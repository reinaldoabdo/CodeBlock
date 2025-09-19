// >>> Função de validação
function validateUser(user) {
    if (!user.name) return false;
    if (!user.email) return false;
    return true;
}
// <<<

// >>> Classe de usuário
class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }
    
    isValid() {
        return validateUser(this);
    }
}
// <<<

// Código normal sem decoração
const user = new User("João", "joao@email.com");
console.log(user.isValid());
