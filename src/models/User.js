import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, }, 
    role: { type: String, enum:['user' , 'admin'] , default:'user'}
}, { timestamps: true })


// hashage de mdp 
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return; // typo corrigée et plus besoin de next()
    this.password = await bcrypt.hash(this.password, 10);
});


//comparaison de mot de passe /apport au mdp haché
userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};




const User = mongoose.model('User', userSchema);
export default User;