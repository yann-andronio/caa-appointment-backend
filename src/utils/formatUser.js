export const formatUser = (user) => ({
    id: user._id,
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    role: user.role
});
