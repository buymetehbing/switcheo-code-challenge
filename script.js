const textPara = "Enjoy a seamless and personalised experience with full control over your digital assets.";
const listContainer = document.getElementById('currency-selection-list');
const fromCurrencyImg = document.getElementById('from-currency-img');
const fromCurrencyCode = document.getElementById('from-currency-code');
const toCurrencyImg = document.getElementById('to-currency-img');
const toCurrencyCode = document.getElementById('to-currency-code');
const fromCurrencyInput = document.getElementById('from-currency');
const toCurrencyInput = document.getElementById('to-currency');
const searchInput = document.getElementById('currency-search-input');
let type = "from";

function typeText(element, text, index) {
    if (index < text.length) {
        element.innerHTML += text.charAt(index);
        setTimeout(function () {
            typeText(element, text, index + 1);
        }, 40);
    }
}

function validateNumberInput(input, pre, post) {
    if (post) {
        input.value = input.value.replace(/[^0-9.]/g, '');
    } else {
        input.value = input.value.replace(/[^0-9]/g, '');
    }

    const dots = input.value.match(/\./g);
    if (dots && dots.length > 1) {
        input.value = input.value.substring(0, input.value.lastIndexOf('.'));
    }

    const [digitsBeforeDot, digitsAfterDot] = input.value.split('.');
    if (digitsBeforeDot.length > pre) {
        input.value = input.value.substring(0, input.value.lastIndexOf(digitsBeforeDot.slice(-1)));
    }

    if (digitsAfterDot && digitsAfterDot.length > post) {
        input.value = `${digitsBeforeDot || '0'}.${digitsAfterDot.slice(0, post)}`;
    }
}

function showOverlay() {
    const overlay = document.getElementById('currency-selection-overlay');
    overlay.classList.remove('hidden');
    searchInput.focus();
    listContainer.scrollTop = 0;
}

function hideOverlay() {
    const overlay = document.getElementById('currency-selection-overlay');
    overlay.classList.add('hidden');
    searchInput.value = '';
}

function updateList(searchTerm, type) {
    let currencyImg = document.getElementById(`${type}-currency-img`);
    let currencyCode = document.getElementById(`${type}-currency-code`);

    listContainer.innerHTML = '';
    priceData
        .filter(item => item.currency.toLowerCase().includes(searchTerm.toLowerCase()))
        .forEach(item => {
            const listItem = document.createElement('button');
            listItem.classList.add('currency-selection-list-item');
    
            const icon = document.createElement('img');
            icon.classList.add('icon');
            icon.src = `tokens/${item.currency}.svg`;
            icon.alt = item.currency;
    
            const contentContainer = document.createElement('div');
            contentContainer.classList.add('currency-selection-list-container');
    
            const name = document.createElement('span');
            name.textContent = item.currency;
    
            const additionalText = document.createElement('div');
            additionalText.classList.add('currency-selection-rate');
            additionalText.textContent = `1 ${item.currency} ≈ ${item.price.toFixed(5)} USD`;
    
            listItem.addEventListener('click', function () {
                currencyImg.src = `tokens/${item.currency}.svg`;
                currencyImg.alt = item.currency;
                currencyCode.textContent = item.currency;
                searchInput.value = '';
                hideOverlay();
                calcCurrency();
                updateRate();
            });
    
            contentContainer.appendChild(name);
            contentContainer.appendChild(additionalText);
    
            listItem.appendChild(icon);
            listItem.appendChild(contentContainer);
            listContainer.appendChild(listItem);
        });
}

function getRate() {
    let fromRate = priceData.find(item => item.currency === fromCurrencyCode.textContent)?.price;
    let toRate = priceData.find(item => item.currency === toCurrencyCode.textContent)?.price;
    return [fromRate,toRate];
}

function updateRate() {
    [fromRate, toRate] = getRate();
    document.getElementById('from-rate').textContent = `1 ${fromCurrencyCode.textContent} ≈ ${(fromRate/toRate).toFixed(5)} ${toCurrencyCode.textContent}`;
    document.getElementById('to-rate').textContent = `1 ${toCurrencyCode.textContent} ≈ ${(toRate/fromRate).toFixed(5)} ${fromCurrencyCode.textContent}`;
}

function calcCurrency() {
    [fromRate, toRate] = getRate();
    if (fromCurrencyInput.value !== '') {
        let amt = parseFloat(fromCurrencyInput.value) * fromRate;
        toCurrencyInput.value = (amt / toRate).toFixed(5);
        document.getElementById('estimate').classList.remove('hidden');
        document.getElementById('estimate').textContent = `≈ ${amt > 99999999 ? Number(amt).toExponential(5) : amt.toFixed(5)} USD`;
    } else {
        clearCurrency();
    }
}

function clearCurrency() {
    toCurrencyInput.value = '';
    fromCurrencyInput.value = '';
    document.getElementById('estimate').classList.add('hidden');
    document.getElementById('estimate').textContent = '';
}

document.addEventListener('DOMContentLoaded', function () {
    const para = document.getElementById('intro-para');
    typeText(para, textPara, 0);

    var buyBtn = document.getElementById('details-btn');
    var sellBtn = document.getElementById('settings-btn');
    var fromCurrencyBtn = document.getElementById('from-currency-btn');
    var toCurrencyBtn = document.getElementById('to-currency-btn');
    var switchBtn = document.getElementById('switch-btn');
    var submitBtn = document.getElementById('submit-button');

    buyBtn.addEventListener('click', function () {
        buyBtn.classList.add('active');
        sellBtn.classList.remove('active');
        document.getElementById('details-1').classList.remove('hidden');
        document.getElementById('switch-btn').classList.remove('hidden');
        document.getElementById('details-2').classList.remove('hidden');
        document.getElementById('submit-button').classList.remove('hidden');

        document.getElementById('settings-1').classList.add('hidden');
        document.getElementById('settings-2').classList.add('hidden');
    });

    sellBtn.addEventListener('click', function () {
        sellBtn.classList.add('active');
        buyBtn.classList.remove('active');
        document.getElementById('details-1').classList.add('hidden');
        document.getElementById('switch-btn').classList.add('hidden');
        document.getElementById('details-2').classList.add('hidden');
        document.getElementById('submit-button').classList.add('hidden');

        document.getElementById('settings-1').classList.remove('hidden');
        document.getElementById('settings-2').classList.remove('hidden');
    });

    switchBtn.addEventListener('click', function () {
       [ fromCurrencyImg.src, toCurrencyImg.src] = [toCurrencyImg.src, fromCurrencyImg.src];
       [ fromCurrencyImg.alt, toCurrencyImg.alt] = [toCurrencyImg.alt, fromCurrencyImg.alt];
       [ fromCurrencyCode.textContent, toCurrencyCode.textContent] = [toCurrencyCode.textContent, fromCurrencyCode.textContent];
       clearCurrency();
       updateRate();
    })

    fromCurrencyBtn.addEventListener('click', function () {
        type = "from";
        updateList('', "from");
    })

    toCurrencyBtn.addEventListener('click', function () {
        type = "to";
        updateList('', "to");
    })

    submitBtn.addEventListener('click', function () {
        if (fromCurrencyInput.value == '' || toCurrencyInput.value == '' 
            || fromCurrencyCode.textContent == toCurrencyCode.textContent) {
            document.querySelector('.swap-form input').classList.add('error');
        } else {
            document.querySelector('.swap').style.transform = 'translateY(-150%)';
            setTimeout(() => {
                document.querySelector('.swap').classList.add('hidden');
                document.getElementById('congrats').classList.remove('hidden');
            }, 1000);
        }
    })

    searchInput.addEventListener('input', function () {
        updateList(this.value, type);
    });

    fromCurrencyInput.addEventListener('input', function () {
        validateNumberInput(this,20,5)
        calcCurrency();
    });

    priceData.sort((a, b) => a.currency.localeCompare(b.currency));
    updateRate();
});

const priceData = [
    {"currency":"BLUR","date":"2023-08-29T07:10:40.000Z","price":0.20811525423728813},
    {"currency":"bNEO","date":"2023-08-29T07:10:50.000Z","price":7.1282679},
    {"currency":"BUSD","date":"2023-08-29T07:10:40.000Z","price":0.9998782611186441},
    {"currency":"USD","date":"2023-08-29T07:10:30.000Z","price":1},
    {"currency":"ETH","date":"2023-08-29T07:10:52.000Z","price":1645.9337373737374},
    {"currency":"GMX","date":"2023-08-29T07:10:40.000Z","price":36.345114372881355},
    {"currency":"STEVMOS","date":"2023-08-29T07:10:40.000Z","price":0.07276706779661017},
    {"currency":"LUNA","date":"2023-08-29T07:10:40.000Z","price":0.40955638983050846},
    {"currency":"RATOM","date":"2023-08-29T07:10:40.000Z","price":10.250918915254237},
    {"currency":"STRD","date":"2023-08-29T07:10:40.000Z","price":0.7386553389830508},
    {"currency":"EVMOS","date":"2023-08-29T07:10:40.000Z","price":0.06246181355932203},
    {"currency":"IBCX","date":"2023-08-29T07:10:40.000Z","price":41.26811355932203},
    {"currency":"IRIS","date":"2023-08-29T07:10:40.000Z","price":0.0177095593220339},
    {"currency":"ampLUNA","date":"2023-08-29T07:10:40.000Z","price":0.49548589830508477},
    {"currency":"KUJI","date":"2023-08-29T07:10:45.000Z","price":0.675},
    {"currency":"STOSMO","date":"2023-08-29T07:10:45.000Z","price":0.431318},
    {"currency":"USDC","date":"2023-08-29T07:10:40.000Z","price":0.989832},
    {"currency":"axlUSDC","date":"2023-08-29T07:10:40.000Z","price":0.989832},
    {"currency":"ATOM","date":"2023-08-29T07:10:50.000Z","price":7.186657333333334},
    {"currency":"STATOM","date":"2023-08-29T07:10:45.000Z","price":8.512162050847458},
    {"currency":"OSMO","date":"2023-08-29T07:10:50.000Z","price":0.3772974333333333},
    {"currency":"rSWTH","date":"2023-08-29T07:10:40.000Z","price":0.00408771},
    {"currency":"STLUNA","date":"2023-08-29T07:10:40.000Z","price":0.44232210169491526},
    {"currency":"LSI","date":"2023-08-29T07:10:50.000Z","price":67.69661525423729},
    {"currency":"OKB","date":"2023-08-29T07:10:40.000Z","price":42.97562059322034},
    {"currency":"OKT","date":"2023-08-29T07:10:40.000Z","price":13.561577966101694},
    {"currency":"SWTH","date":"2023-08-29T07:10:45.000Z","price":0.004039850455012084},
    {"currency":"USC","date":"2023-08-29T07:10:40.000Z","price":0.994},
    {"currency":"WBTC","date":"2023-08-29T07:10:52.000Z","price":26002.82202020202},
    {"currency":"wstETH","date":"2023-08-29T07:10:40.000Z","price":1872.2579742372882},
    {"currency":"YieldUSD","date":"2023-08-29T07:10:40.000Z","price":1.0290847966101695},
    {"currency":"ZIL","date":"2023-08-29T07:10:50.000Z","price":0.01651813559322034}]
