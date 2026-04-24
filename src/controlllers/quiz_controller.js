import pool from "../config/db.js";

export const addQuiz = async (req, res) => {
  const { category, image, description, publisher, questions } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const quizResult = await client.query(
      `INSERT INTO quizzes (category, image_url, description, publisher)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [category, image, description, publisher]
    );

    const quizId = quizResult.rows[0].id;
    await Promise.all(
      questions.map((q, index) =>
        client.query(
          `INSERT INTO questions (quiz_id, question, answer, order_index)
           VALUES ($1, $2, $3, $4)`,
          [quizId, q.question, q.answer, index]
        )
      )
    );

    await client.query("COMMIT");

    res.status(201).json({ message: "Quiz saved", quiz: {
    id: quizId,
    category,
    image,
    description,
    publisher,
    questions,
  },});

  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: "Failed to save quiz", error: err.message });

  } finally {
    client.release();
  }
};

export const fetchQuiz = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        q.id, q.category, q.description, q.publisher, q.image_url,
        qn.id AS question_id, qn.question, qn.answer, qn.order_index
       FROM quizzes q
       LEFT JOIN questions qn ON qn.quiz_id = q.id
       ORDER BY q.id, qn.order_index`
    );

    if (result.rows.length === 0) {
      return res.status(200).json({ quizzes: [] });
    }

    // new concept: reduce() here groups flat JOIN rows into
    // an array of quiz objects, each with a nested questions array
    // JOIN gives one row per question, so a quiz with 3 questions = 3 rows
    // reduce() merges those 3 rows back into one quiz object
    const quizzes = result.rows.reduce((acc, row) => {
      const existing = acc.find((q) => q.id === row.id);

      if (existing) {
        // quiz already added, just push the next question
        existing.questions.push({
          id: row.question_id,
          question: row.question,
          answer: row.answer,
          orderIndex: row.order_index,
        });
      } else {
        // first time seeing this quiz, create the object
        acc.push({
          id: row.id,
          category: row.category,
          description: row.description,
          publisher: row.publisher,
          image: row.image_url,
          questions: row.question_id
            ? [
                {
                  id: row.question_id,
                  question: row.question,
                  answer: row.answer,
                  orderIndex: row.order_index,
                },
              ]
            : [], // LEFT JOIN — quiz might have no questions yet
        });
      }

      return acc;
    }, []);

    res.status(200).json({ quizzes });

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch quizzes", error: err.message });
  }
};

export const deleteQuiz = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM quizzes WHERE id = $1 RETURNING id`,
      [id]
    );

    // if no row returned, quiz with this id doesn't exist
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // questions are auto-deleted by ON DELETE CASCADE
    res.status(200).json({ message: "Quiz deleted", deletedId: Number(id) });

  } catch (err) {
    res.status(500).json({ message: "Failed to delete quiz", error: err.message });
  }
};

export const updateQuiz = async (req, res) => {
  const { id } = req.params;
  const { category, image, description, publisher, questions } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Step 1: update quiz main info
    const quizResult = await client.query(
      `UPDATE quizzes 
       SET category = $1, image_url = $2, description = $3, publisher = $4
       WHERE id = $5
       RETURNING id`,
      [category, image, description, publisher, id]
    );

    // if no row returned, quiz doesn't exist
    if (quizResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Step 2: delete all old questions for this quiz
    // easiest approach — wipe old ones and re-insert updated ones
    await client.query(
      `DELETE FROM questions WHERE quiz_id = $1`,
      [id]
    );

    // Step 3: insert updated questions
    await Promise.all(
      questions.map((q, index) =>
        client.query(
          `INSERT INTO questions (quiz_id, question, answer, order_index)
           VALUES ($1, $2, $3, $4)`,
          [id, q.question, q.answer, index]
        )
      )
    );

    await client.query("COMMIT");

    res.status(200).json({
      message: "Quiz updated successfully",
      quiz: {
        id: Number(id),
        category,
        image,
        description,
        publisher,
        questions,
      },
    });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: "Failed to update quiz", error: err.message });

  } finally {
    client.release();
  }
};