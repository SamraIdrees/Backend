import { connect } from 'mongoose';

const dbconnection = async () => {
    await connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to database');
    })
    .catch((err) => {
        console.log('Error connecting to database- MONGODB', err);
    });
}
export default dbconnection;