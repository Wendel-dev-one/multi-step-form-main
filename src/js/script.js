// Validação de formulário - Step 1
const form1 = document.querySelector('.form.ativo');
const inputs = form1.querySelectorAll('input[required]');
const submitBtn = form1.querySelector('.btn-next');

// Função para validar um input
function validateInput(input) {
    const formGroup = input.closest('.form-group');
    
    if (input.value.trim() === '') {
        formGroup.classList.add('error');
        return false;
    } else {
        if (input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                formGroup.classList.add('error');
                return false;
            }
        }
        formGroup.classList.remove('error');
        return true;
    }
}

// Remover erro quando o usuário começa a digitar
inputs.forEach(input => {
    input.addEventListener('input', () => {
        if (input.value.trim() !== '') {
            input.closest('.form-group').classList.remove('error');
        }
    });

    input.addEventListener('blur', () => {
        validateInput(input);
    });
});

// Validar ao enviar o formulário
submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    let isValid = true;
    inputs.forEach(input => {
        if (!validateInput(input)) {
            isValid = false;
        }
    });

    if (isValid) {
        console.log('Formulário válido!');
        // Aqui você pode adicionar a lógica para ir ao próximo passo
    }
});
