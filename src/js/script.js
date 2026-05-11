// Variáveis de cada form
const form1 = document.getElementById('form-personal-info');
const form2 = document.getElementById('form-select-plan');
const form3 = document.getElementById('form-pick-add-ons');
const form4 = document.getElementById('form-summary');
const form5 = document.getElementById('form-check');

// Função para validar um input genérico (usada no form1)
function validateInput(input) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return true; // Para inputs sem .form-group
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

// --- ETAPA 1: Validação dos campos pessoais ---
const inputs1 = form1.querySelectorAll('input[required]');
const btnNext1 = form1.querySelector('.btn-next');

inputs1.forEach(input => {
    input.addEventListener('input', () => {
        if (input.value.trim() !== '') {
            const formGroup = input.closest('.form-group');
            if (formGroup) formGroup.classList.remove('error');
        }
    });
    input.addEventListener('blur', () => {
        validateInput(input);
    });
});

btnNext1.addEventListener('click', (e) => {
    e.preventDefault();
    let isValid = true;
    inputs1.forEach(input => {
        if (!validateInput(input)) {
            isValid = false;
        }
    });
    if (isValid) {
        form1.classList.remove('ativo');
        form2.classList.add('ativo');
    }
});

// --- ETAPA 2: Validação do plano selecionado ---
const btnNext2 = form2.querySelector('.btn-next');
const btnBack2 = form2.querySelector('.btn-back');


// Variáveis para armazenar escolhas
let selectedPlan = null;
let billingType = 'monthly';

// --- Atualização dinâmica dos valores dos planos e add-ons ---
const billingInput = form2.querySelector('input[name="billing"]');
const planCards = form2.querySelectorAll('.plans label.card');
const planPrices = form2.querySelectorAll('.plan-price span');
const planFree = [
    {monthly: '', yearly: '2 months free'},
    {monthly: '', yearly: '2 months free'},
    {monthly: '', yearly: '2 months free'}
];
const addOnCards = form3.querySelectorAll('.addon-card');

function updatePlanAndAddOnPrices() {
    // Atualiza preços dos planos
    planCards.forEach((card, idx) => {
        const priceSpan = card.querySelector('.plan-price span');
        const freeText = card.querySelector('.plan-free');
        if (idx === 0) {
            priceSpan.textContent = billingType === 'yearly' ? '$90/yr' : '$9/mo';
        } else if (idx === 1) {
            priceSpan.textContent = billingType === 'yearly' ? '$120/yr' : '$12/mo';
        } else if (idx === 2) {
            priceSpan.textContent = billingType === 'yearly' ? '$150/yr' : '$15/mo';
        }
        // Adiciona/remover texto de meses grátis
        let free = billingType === 'yearly' ? '2 months free' : '';
        let freeElem = card.querySelector('.plan-free');
        if (!freeElem) {
            freeElem = document.createElement('span');
            freeElem.className = 'plan-free';
            card.querySelector('.plan-price').appendChild(freeElem);
        }
        freeElem.textContent = free;
        freeElem.style.display = free ? 'block' : 'none';
    });
    // Atualiza preços dos add-ons
    addOnCards.forEach(card => {
        const priceSpan = card.querySelector('.addon-price');
        if (!priceSpan) return;
        if (card.textContent.includes('Online service')) {
            priceSpan.textContent = billingType === 'yearly' ? '+$10/yr' : '+$1/mo';
        } else if (card.textContent.includes('Larger storage')) {
            priceSpan.textContent = billingType === 'yearly' ? '+$20/yr' : '+$2/mo';
        } else if (card.textContent.includes('Customizable profile')) {
            priceSpan.textContent = billingType === 'yearly' ? '+$20/yr' : '+$2/mo';
        }
    });
}

if (billingInput) {
    billingInput.addEventListener('change', () => {
        billingType = billingInput.checked ? 'yearly' : 'monthly';
        updatePlanAndAddOnPrices();
    });
}

// Atualiza os preços ao carregar a página
updatePlanAndAddOnPrices();

btnNext2.addEventListener('click', (e) => {
    e.preventDefault();
    // Pega o plano selecionado
    const planInput = form2.querySelector('input[name="plan"]:checked');
    if (!planInput) {
        alert('Selecione um plano.');
        return;
    }
    selectedPlan = planInput.value;
    // Pega o tipo de cobrança
    const billingInput = form2.querySelector('input[name="billing"]');
    billingType = billingInput && billingInput.checked ? 'yearly' : 'monthly';
    form2.classList.remove('ativo');
    form3.classList.add('ativo');
});

btnBack2.addEventListener('click', (e) => {
    e.preventDefault();
    form2.classList.remove('ativo');
    form1.classList.add('ativo');
});

// --- ETAPA 3: Validação dos add-ons (opcional: pelo menos um) ---
const btnNext3 = form3.querySelector('.btn-next');
const btnBack3 = form3.querySelector('.btn-back');

let selectedAddons = [];

btnNext3.addEventListener('click', (e) => {
    e.preventDefault();
    // Pega os add-ons selecionados
    const addons = Array.from(form3.querySelectorAll('input[name="addons"]:checked'));
    selectedAddons = addons.map(input => input.value);
    // Se quiser obrigar pelo menos um add-on, descomente abaixo:
    // if (selectedAddons.length === 0) {
    //     alert('Selecione pelo menos um add-on.');
    //     return;
    // }
    updateSummary();
    form3.classList.remove('ativo');
    form4.classList.add('ativo');
});

btnBack3.addEventListener('click', (e) => {
    e.preventDefault();
    form3.classList.remove('ativo');
    form2.classList.add('ativo');
});

// --- ETAPA 4: Resumo e confirmação ---
const btnBack4 = form4.querySelector('.btn-back');
const btnConfirm = form4.querySelector('.btn-confirm');

function updateSummary() {
    // Atualiza o plano
    const summaryPlan = form4.querySelector('.summary-plan p');
    const summaryPlanPrice = form4.querySelector('.summary-plan .price');
    let planLabel = '';
    let planPrice = '';
    if (selectedPlan === 'arcade') {
        planLabel = 'Arcade';
        planPrice = billingType === 'yearly' ? '$90/yr' : '$9/mo';
    } else if (selectedPlan === 'advanced') {
        planLabel = 'Advanced';
        planPrice = billingType === 'yearly' ? '$120/yr' : '$12/mo';
    } else if (selectedPlan === 'pro') {
        planLabel = 'Pro';
        planPrice = billingType === 'yearly' ? '$150/yr' : '$15/mo';
    }
    summaryPlan.textContent = planLabel + (billingType === 'yearly' ? ' (Yearly)' : ' (Monthly)');
    summaryPlanPrice.textContent = planPrice;

    // Atualiza os add-ons
    const summaryAddons = form4.querySelector('.summary-addons');
    summaryAddons.innerHTML = '';
    let total = 0;
    selectedAddons.forEach(addon => {
        let addonLabel = '';
        let addonPrice = '';
        if (addon === 'Online service') {
            addonLabel = 'Online service';
            addonPrice = billingType === 'yearly' ? '+$10/yr' : '+$1/mo';
            total += billingType === 'yearly' ? 10 : 1;
        } else if (addon === 'Larger storage') {
            addonLabel = 'Larger storage';
            addonPrice = billingType === 'yearly' ? '+$20/yr' : '+$2/mo';
            total += billingType === 'yearly' ? 20 : 2;
        } else if (addon === 'Customizable profile') {
            addonLabel = 'Customizable profile';
            addonPrice = billingType === 'yearly' ? '+$20/yr' : '+$2/mo';
            total += billingType === 'yearly' ? 20 : 2;
        }
        const div = document.createElement('div');
        div.className = 'addon';
        div.innerHTML = `<span>${addonLabel}</span><span>${addonPrice}</span>`;
        summaryAddons.appendChild(div);
    });

    // Atualiza o total
    let planBase = 0;
    if (selectedPlan === 'arcade') planBase = billingType === 'yearly' ? 90 : 9;
    if (selectedPlan === 'advanced') planBase = billingType === 'yearly' ? 120 : 12;
    if (selectedPlan === 'pro') planBase = billingType === 'yearly' ? 150 : 15;
    const totalValue = planBase + total;
    const summaryTotal = form4.querySelector('.summary-total strong');
    summaryTotal.textContent = billingType === 'yearly' ? `+$${totalValue}/yr` : `+$${totalValue}/mo`;
    const summaryTotalLabel = form4.querySelector('.summary-total span');
    summaryTotalLabel.textContent = billingType === 'yearly' ? 'Total (per year)' : 'Total (per month)';
}

btnBack4.addEventListener('click', (e) => {
    e.preventDefault();
    form4.classList.remove('ativo');
    form3.classList.add('ativo');
});

btnConfirm.addEventListener('click', (e) => {
    e.preventDefault();
    // Aqui você pode fazer validações finais se necessário
    form4.classList.remove('ativo');
    form5.classList.add('ativo');
});

