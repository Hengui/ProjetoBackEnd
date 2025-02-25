const User = require('../dao/models/user');
const nodemailer = require('nodemailer');
const { ErrorHandler } = require('../errors/customErrors');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, 'name email role');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.deleteInactiveUsers = async (req, res, next) => {
  try {
    const threshold = new Date(Date.now() -2 * 24 * 60 * 60 * 1000);
    const inactiveUsers = await User.find({ lastOnline: { $lt: threshold } });
    
    for (const user of inactiveUsers) {
      await sendDeletionEmail(user.email);
    }
    
    const result = await User.deleteMany({ lastOnline: { $lt: threshold } });
    res.json({ deletedCount: result.deletedCount });
  } catch (error) {
    next(error);
  }
};

exports.renderUserManagementView = async (req, res, next) => {
  try {
    const users = await User.find({}, 'name email role lastOnline');
    res.render('userManagement', { users });
  } catch (error) {
    next(error);
  }
};

async function sendDeletionEmail(recipientEmail) {
  let transporter = nodemailer.createTransport({
    host: 'smtp.example.com',
    port: 587,
    secure: false, 
    auth: {
      user: 'usuario@example.com',
      pass: 'senha'
    }
  });
  
  await transporter.sendMail({
    from: '"E-commerce" <no-reply@example.com>',
    to: recipientEmail,
    subject: 'Conta Excluída por Inatividade',
    text: 'Sua conta foi excluída devido à inatividade. Caso queira reativá-la, entre em contato conosco.'
  });
}
