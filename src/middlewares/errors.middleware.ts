

export const EmailAlreadyExists = {
    type: 'EmailAlreadyExistsError',
    message:'Já existe um usuário com este endereço de e-mail.',
    code: '409'
}

export const generalServerError = {
    type: 'GeneralError',
    message:'Erro no servidor',
    code: '500'
}