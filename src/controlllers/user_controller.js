import pool from "../config/db.js";

export const fetchNotes = async (req,res)=>{

  const sql = "SELECT * from notes;";
  try {
    const result = await pool.query(sql);
    if(result.rows == 0){
      return res.status(401).json({message:"Notes not found!"})
    }
    return res.status(200).json({message:"data fetched sucessfully",data:result.rows})
  } catch (error) {
    console.log("FETCHING_ERROR:",error);
    return res.status(500).json({message:"problem in fetching"});
  }
}

export const fetchQuizs = async (req,res)=>{
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
}


export const fetchNotices = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM notices ORDER BY date DESC`
    );
    res.status(200).json({ notices: result.rows });

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notices", error: err.message });
  }
};