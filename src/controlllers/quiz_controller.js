import pool from "../config/db.js";

export const addQuiz = async (req, res) => {
  const { category, imageUrl, description, publisher, questions } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const quizResult = await client.query(
      `INSERT INTO quizzes (category, image_url, description, publisher)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [category, imageUrl, description, publisher]
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
    imageUrl,
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