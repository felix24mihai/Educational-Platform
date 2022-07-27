const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const checkRole = require('../../middleware/checkRole');
const compareUsers = require('../../middleware/compareUsers');
const { check, validationResult } = require('express-validator');

const LearningMaterial = require('../../models/LearningMaterial');

// @route   GET /api/learning-materials/:module_name
// @desc    Get problems, lessons and quizzes by module name
// @access  Private
router.get('/:module_name', async (req, res) => {
  try {
    const learningMaterials = await LearningMaterial.find({
      module: req.params.module_name,
    }).sort({ expNeeded: 1 });
    res.json(learningMaterials);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/learning-materials/add-problem
// @desc    Create a problem
// @access  Private
router.post(
  '/add-problem',
  [
    auth,
    checkRole('mentor'),
    check('name', 'Name is required').not().isEmpty(),
    check('module', 'Module is required').not().isEmpty(),
    check('expNeeded', 'Minimum experience is required').not().isEmpty(),
    check(
      'expNeeded',
      'Minimum experience must be a positive number'
    ).isFloat(),
    check('expGained', 'Experience gained is required').not().isEmpty(),
    check('expGained', 'Experience gained must be a positive number').isFloat(),
    check('body', 'Body is required').not().isEmpty(),
    check('shortDescription', 'Short description is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      module,
      expNeeded,
      expGained,
      expMax,
      body,
      shortDescription,
      tests,
      examples,
      hints,
    } = req.body;

    try {
      problem = new LearningMaterial({
        name,
        type: 'Problem',
        module,
        expNeeded,
        expGained,
        expMax,
        body,
        shortDescription,
        tests,
        examples,
        hints,
      });

      await problem.save();

      res.json(problem);
    } catch (err) {
      res.status(500).json({ error: [{ msg: 'Server error' }] });
    }
  }
);

// @route   POST /api/learning-materials/add-lesson
// @desc    Create a lesson
// @access  Private
router.post(
  '/add-lesson',
  [
    auth,
    checkRole('mentor'),
    check('name', 'Name is required').not().isEmpty(),
    check('module', 'Module is required').not().isEmpty(),
    check('expNeeded', 'Minimum experience is required').not().isEmpty(),
    check(
      'expNeeded',
      'Minimum experience must be a positive number'
    ).isFloat(),
    check('expGained', 'Experience gained is required').not().isEmpty(),
    check('expGained', 'Experience gained must be a positive number').isFloat(),
    check('body', 'Body is required').not().isEmpty(),
    check('shortDescription', 'Short description is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      module,
      expNeeded,
      expGained,
      expMax,
      body,
      shortDescription,
    } = req.body;

    try {
      lesson = new LearningMaterial({
        name,
        type: 'Lesson',
        module,
        expNeeded,
        expGained,
        expMax,
        body,
        shortDescription,
      });

      await lesson.save();

      res.json(lesson);
    } catch (err) {
      res.status(500).json({ error: [{ msg: 'Server error' }] });
    }
  }
);

// @route   POST /api/learning-materials/add-quiz
// @desc    Create a quiz
// @access  Private
router.post(
  '/add-quiz',
  [
    auth,
    checkRole('mentor'),
    check('name', 'Name is required').not().isEmpty(),
    check('module', 'Module is required').not().isEmpty(),
    check('expNeeded', 'Minimum experience is required').not().isEmpty(),
    check('expNeeded', 'Minimum experience must be a positive number').isFloat({
      gt: 0,
    }),
    check('expGained', 'Experience gained is required').not().isEmpty(),
    check('expGained', 'Experience gained must be a positive number').isFloat({
      gt: 0,
    }),
    check('body', 'Body is required').not().isEmpty(),
    check('shortDescription', 'Short description is required').not().isEmpty(),
    check('rightAnswers', 'You must add at least one right answer')
      .not()
      .isEmpty(),
    check(
      'waitingMinutes',
      'The number of minutes a user must wait before retaking the quiz is required'
    )
      .not()
      .isEmpty(),
    check(
      'waitingMinutes',
      'The number of minutes a user must wait before retaking the quiz must be a positive integer'
    ).isInt({ gt: 0 }),
    check('failedQuizMessage', 'A message for a failed quiz is required')
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      module,
      expNeeded,
      expGained,
      expMax,
      body,
      shortDescription,
      waitingMinutes,
      failedQuizMessage,
      wrongAnswers,
      rightAnswers,
    } = req.body;

    try {
      quiz = new LearningMaterial({
        name,
        type: 'Quiz',
        module,
        expNeeded,
        expGained,
        expMax,
        body,
        shortDescription,
        waitingMinutes,
        failedQuizMessage,
        wrongAnswers,
        rightAnswers,
      });

      await quiz.save();

      res.json(quiz);
    } catch (err) {
      res.status(500).json({ error: [{ msg: 'Server error' }] });
    }
  }
);

// @route   DELETE /api/learning-materials/:learning_material_id
// @desc    Delete a learning material
// @access  Private
router.delete(
  '/:learning_material_id',
  [auth, checkRole('mentor')],
  async (req, res) => {
    try {
      const learningMaterial = await LearningMaterial.findById(
        req.params.learning_material_id
      );
      if (!learningMaterial) {
        return res.status(404).json({ msg: 'Learning material not found' });
      }
      await learningMaterial.remove();
      // TODO update next and prev
      res.json({ msg: 'Learning material deleted' });
    } catch (err) {
      if (err.kind == 'ObjectId') {
        return res.status(404).json({ msg: 'Learning material not found' });
      }
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
