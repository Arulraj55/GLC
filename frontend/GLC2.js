const whole=document.querySelector('.whole')
const left=document.querySelector('.left')
const right=document.querySelector('.right')
const up=document.querySelector('.up')
const down=document.querySelector('.down')
const sl=right.querySelectorAll('div').length

let active=2
up.addEventListener("click",()=> chsl('up'))
down.addEventListener("click",()=> chsl('down'))

const heights=whole.clientHeight
let i=1

function changeTransform() {
    if (i<sl) {
        left.style.transform = `translateY(-${i*heights}px)`;
        right.style.transform = `translateY(-${i*heights}px)`;
        i++;
        setTimeout(changeTransform,2000);
    }
}
setTimeout(changeTransform,2000);

const chsl=(pos)=>{
    const height=whole.clientHeight
    if(pos==='up'){
        active++
        if(active>sl-1){
            active=0
        }
    }

    if(pos==='down'){
        active--
        if(active<0){
            active=sl-1
        }
    }

    right.style.transform=`translateY(-${active*height}px)`
    left.style.transform=`translateY(-${active*height}px)`
}