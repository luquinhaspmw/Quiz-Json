function reload(){
    location.reload();
}
const main = (jsonQuiz)=>{
    let pontos = 0;
    let quiz = document.querySelector(".quiz");
    // get questions
    const get = async (url,func,two=0)=>{
            const dados = await fetch(url);
            const json = await dados.json();
            const array = await json.perguntas;
            two === 0 ? func(array) : func(array,two);
    }

    const erro_json = ()=>{
        let erro_card = document.createElement("div");
        erro_card.classList.add("erro_card");
        erro_card.innerHTML = `
            <h2>Ocorreu um erro ao carregar a página!</h2>
            <p>Tente:</p>
            <ul>
                <li> Verificar seu arquivo json &#x1F55B
                <li> Verificar alterações no seu codigo javascript &#x1F55B
            </ul>
        `
        document.body.appendChild(erro_card);
    }
    const makeQuestions = (url)=>{
        const insertHTML = (array)=>{
            let contForId = 0;
            array.forEach(pergunta=>{
                if(pergunta.alternativas == undefined){
                    if(quiz.parentNode) {
                        quiz.parentNode.removeChild(quiz);
                        erro_json();
                    }
                }else{
                    contForId++;

                let alternativas = pergunta.alternativas;
                // creat element div for question in html
                let pergunta_div = document.createElement("div");
                pergunta_div.classList.add("pergunta");
                pergunta_div.setAttribute("id",contForId)

                // creat element div for title of ask
                let div_title = document.createElement("div");
                div_title.classList.add("div_title");


                // creat element h2 for title of array length
                let h2 = document.createElement("h2");
                h2.innerText = `Pergunta ${contForId} de ${array.length}`;

                // creat element p  for question title
                let p = document.createElement("p");
                p.innerText = `${pergunta.pergunta}`;

                // creat element div  for question options
                let div_questions = document.createElement("div");
                div_questions.classList.add("options");

                // creat element form  for question options
                let form = document.createElement("form");
                form.innerHTML = `
                    <input type="button" class="button button-option"  accesskey="${contForId}" about="1" value="${alternativas[1]}">
                    <input type="button" class="button button-option"  accesskey="${contForId}" about="2" value="${alternativas[2]}">
                    <input type="button" class="button button-option"  accesskey="${contForId}" about="3" value="${alternativas[3]}">
                    <input type="button" class="button button-option"  accesskey="${contForId}" about="4" value="${alternativas[4]}">
                    <hr>
                        <input type="submit" class="button button-submit" value="CONFIRMAR">
                `
                // root = quiz
                quiz.appendChild(pergunta_div);

                //  child of root = pergunta_div
                pergunta_div.appendChild(div_title);
                pergunta_div.appendChild(div_questions);

                //child of pergunta_div = div_title
                div_title.appendChild(h2);
                div_title.appendChild(p);

                // child of pergunta_div = div_questions;
                div_questions.appendChild(form);
            
                
                }
                
            })
            sendOption(url);
            selectOption();
        }
        get(url,insertHTML);
    }
    const selectOption = ()=>{
        // select all buttons
        let buttons = document.querySelectorAll(".button-option");
        const checkSelected = (button)=>{
            // cleaning classList 
            buttons.forEach(button =>{
                button.classList.contains("selected") ? button.classList.remove("selected") : button;
            })
            // add class
            button.classList.toggle("selected");
        }
        
        // add function for all buttons of option
        buttons.forEach(button =>{
            button.addEventListener("click",()=>{
                checkSelected(button);
            })
        })
    }
    const finish = ()=>{
        let h1 = document.createElement("h1");
        h1.innerHTML = `<div>Pontuação: ${pontos} </div><br><a href="#" class="pontos-button" onclick="reload()">Jogar novamente</a>`;
        h1.classList.add("pontos")

        quiz.appendChild(h1)
    }
    const pointer = (index,index_questions,state=true)=>{
        state == true ? pontos++ : pontos = pontos;
        index.getAttribute("id") == index_questions ? finish() : true;
    }
    const sendOption = (url)=>{
        const next = (index,alternativa,escolhida)=>{
            let pergunta_atual = document.getElementById(index)
            let perguntas = document.querySelectorAll(".pergunta");

            const choiceReply = (array,index)=>{
                let index_of_question_all = perguntas.length;
                let index_of_question = pergunta_atual;
                let this_pergunta_atual = array[index - 1];
                let alternativa_escolhida = this_pergunta_atual.alternativas[escolhida];

                this_pergunta_atual.correta == alternativa_escolhida ? pointer(index_of_question,index_of_question_all) : pointer(index_of_question,index_of_question_all,false)
            }
            
            get(url,choiceReply,index);
            const apply = (index,state)=>{
                if(state == true){
                    perguntas[index - 1].classList.toggle("next");
                    perguntas.forEach(item=>{
                        item.style.transform = `translate(-${index}00%)`;
                    })
                }else{
                    perguntas[index - 1].classList.toggle("next");
                    perguntas.forEach(item=>{
                        item.style.transform = `translate(-${index}00%)`;
                    })
                }
                
            }

            index == perguntas.length ? apply(index,true) : apply(index,false);
        }
        let buttons = document.querySelectorAll(".button-submit");

        // sending choice user
        const submit = (e,select)=>{
            e.preventDefault(); 
            let index = select.getAttribute("accesskey");
            let index_choice = select.getAttribute("about");
            let alternativa = select;
            next(index,alternativa,index_choice);
        }
        const erro = (text,e)=>{
            alert(`Erro: ${text}`)
            e.preventDefault();
        }
        buttons.forEach(button => {
            button.addEventListener("click", (button)=> {
                let user_selected = document.querySelector(".selected");
                user_selected == null ? erro("Escolha uma das opções",button) : submit(button,user_selected);
            })
        })
    }
    makeQuestions(jsonQuiz);
    
}
main("onePiece.json");