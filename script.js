const mainProduct = {
    plainBurger: {
        name: 'Гамбургер простой', 
        price: 10000,
        url: 'images/product2.jpg',
        amount: 0,
        kcal: 250, 
        get totalSum(){
            return this.price * this.amount
        },
        get totalKcal(){
            return this.kcal * this.amount
        }
    },
    freshBurger: {
        name: 'Гамбургер FRESH', 
        price: 20500,
        url: 'images/product1.jpg',
        amount: 0,
        kcal: 330, 
        get totalSum(){
            return this.price * this.amount
        },
        get totalKcal(){
            return this.kcal * this.amount
        }
    },
    freshCombo: {
        name: 'FRESH COMBO', 
        price: 31900,
        url: 'images/product3.jpg',
        amount: 0,
        kcal: 560, 
        get totalSum(){
            return this.price * this.amount
        },
        get totalKcal(){
            return this.kcal * this.amount
        }
    }
}
const extraProduct = {
    doubleMayonnaise: {
        name: 'Двойной майонез', 
        price: 2000,
        kcal: 70
    },
    lettuce: {
        name: 'Салатный лист', 
        price: 1000,
        kcal: 4
    },
    cheese: {
        name: 'Сыр', 
        price: 3000,
        kcal: 100
    }
}

const productBtns       = document.querySelectorAll('.main__product-btn'),
      extraProductCheck = document.querySelectorAll('.main__product-checkbox'),
      products          = document.querySelectorAll('.main__product'),
      cartBtn           = document.querySelector('.addCart'),
      cartModal         = document.querySelector('.receipt'),
      closeCartModal    = document.querySelector('.receipt__window-close'),
      cartTotalPrice    = document.querySelector('.receipt__window-totalPrice span'),
      cartTotalKcal     = document.querySelector('.receipt__window-totalKcal span'),
      cartOrderBtn      = document.querySelector('.receipt__window-btn'),
      cartSpan          = document.querySelector('.receipt__window-out span'),
      headerTimerLvl    = document.querySelector('.header__timer-extra'),
      alertText         = document.querySelector('.myAlert-message'),
      cartProductList   = document.querySelector('.receipt__window-out'),
      myAlert           = document.getElementById("myAlert");

cartOrderBtn.disabled = true

productBtns.forEach (btn => {
    btn.addEventListener('click', function () {
    productAmount(this)
    })
});


function productAmount (btn) {
    const parent        = btn.closest('.main__product'),
          parentId      = parent.getAttribute('id'),
          selectedProd  = mainProduct[parentId],
          productNum    = parent.querySelector('.main__product-num')
    let   symbol        = btn.getAttribute('data-symbol')

    if (selectedProd.amount < 10 && selectedProd.amount > 0) {
        if (symbol === '+') {
            selectedProd.amount++
        } else if (symbol === '-') {
            selectedProd.amount--
        }
    } else if (selectedProd.amount == 0) {
        if (symbol === '+') {
            selectedProd.amount++
        }
    } else if (selectedProd.amount == 10) {
        if (symbol === '-') {
            selectedProd.amount--
        } else if (symbol === '+') {
            alertText.innerHTML = 'Вы достигли максимального количества данной продукции доступного для заказа'
            showAlert()
        }
    }
    productNum.innerHTML = selectedProd.amount

    const productPrice  = parent.querySelector('.main__product-price span')
    productPrice.innerHTML  = selectedProd.totalSum

    const productKcal  = parent.querySelector('.main__product-call span')
    productKcal.innerHTML  = selectedProd.totalKcal

    addToCart(productKcal.innerHTML, productPrice.innerHTML)
}


extraProductCheck.forEach(checkbox => {
    checkbox.addEventListener('input', check)
})

function check(){
    const   parent       = this.closest('.main__product'),
            parentId     = parent.getAttribute('id'),
            productPrice = parent.querySelector('.main__product-price span'),
            productKcal  = parent.querySelector('.main__product-call span'),
            attr         = this.getAttribute('data-extra');
    
    if(this.checked){
        mainProduct[parentId].price += extraProduct[attr].price;
        mainProduct[parentId].kcal += extraProduct[attr].kcal;
    }
    else{
        mainProduct[parentId].price -= extraProduct[attr].price;
        mainProduct[parentId].kcal -= extraProduct[attr].kcal;
    }
    
    const {totalSum, totalKcal} = mainProduct[parentId];
    productPrice.innerHTML = totalSum;
    productKcal.innerHTML = totalKcal;

    addToCart()
}

function showAlert(){
    myAlert.className = "show";
    setTimeout(function(){hideAlert(); }, 5000);
}
function hideAlert(){
    myAlert.className = myAlert.className.replace("show", "hide");
}

cartBtn.addEventListener('click', (e) => {
    e.preventDefault
    cartModal.classList.add('active')   
})
closeCartModal.addEventListener('click', function () {
    cartModal.classList.remove('active') 
})


function addToCart(prodKcal, prodPrice){
    const orderArray = [],
          finalPrice = allPrice(prodPrice),
          finalKcal  = allKcal(prodKcal)

          for (const key in mainProduct) {
              const po = mainProduct[key]
              if (po.amount) {
                  orderArray.push(po)
        }
    }
    cartProductList.innerHTML = ''
    cartTotalPrice.innerHTML  = finalPrice
    cartTotalKcal.innerHTML   = finalKcal
    
    for (let i = 0; i < orderArray.length; i++) {
        cartProductList.innerHTML += cardItemBurger(orderArray[i])
    }
    if (orderArray.length === 0) {
        cartProductList.innerHTML = addCartSpan()
        cartOrderBtn.disabled = true
    } 
    if (orderArray.length != 0) {
        cartOrderBtn.disabled = false
    }

}

function allPrice(){
    let total = 0
    for (const key in mainProduct) {
        total += mainProduct[key].totalSum
    }
    return total
}
function allKcal(){
    let total = 0
    for (const key in mainProduct) {
        total += mainProduct[key].totalKcal
    }
    return total
}

function cardItemBurger(productData){
    const {name, totalSum: price, url, amount} = productData
    return `
            <div class="receipt__cardItem">
                <div class="receipt__cardItem-info">
                    <img src="${url}" alt="" class="receipt__cardItem-infoImg">
                    <div class="receipt__cardItem-infoSub">
                        <span class="receipt__cardItem-infoName">${name}</span>
                        <span class="receipt__cardItem-infoPrice">${price}</span>
                    </div>
                </div>
                <span class="receipt__cardItem-count">${amount}</span>
            </div>
            `
}

window.addEventListener('click', e => {
    const click = e.target
    if(click.classList.contains('active')){
        cartModal.classList.remove('active') 
    }
})


cartOrderBtn.addEventListener('click', function () {
    myAlert.style.background = '#008000'
    alertText.innerHTML      = 'Ваш заказ принят!'
    cartModal.classList.remove('active') 
    const btn = document.querySelector('.close');
    cartOrderBtn.disabled = true
    btn.remove()
    showAlert()
    setTimeout(() => {
        location.reload()
    }, 3000);
})

function addCartSpan() {
    return `
         <span>В корзине пусто!</span>
        `
}

let num = 0
function timerLvl() {
    if (num >= 0 && num <= 50) {
        headerTimerLvl.innerHTML = num
        num++
        setTimeout(() => {
            timerLvl()
        }, 50);
    } else if (num >= 51 && num <= 90) {
        headerTimerLvl.innerHTML = num
        num++
        setTimeout(() => {
            timerLvl()
        }, 100); 
    } else if (num >= 91 && num <= 100) {
        headerTimerLvl.innerHTML = num
        num++
        setTimeout(() => {
            timerLvl()
        }, 150); 
    }
}

timerLvl()
