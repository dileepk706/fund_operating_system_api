import mongoose from 'mongoose';
const connectDB = async (connectionUrl:string):Promise<void> => {
  try {
    await mongoose.connect(connectionUrl);
    console.log('MongoDB connected!');
  } catch (err) {
    console.log(err);
    
    throw new Error('Failed to connect to MongoDB',)
  }
};
export default connectDB