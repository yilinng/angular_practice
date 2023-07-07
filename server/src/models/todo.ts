import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
  },
  updateDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

todoSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

export default mongoose.model('Todo', todoSchema);