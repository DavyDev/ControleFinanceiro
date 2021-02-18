// Classe que ira verificar se há algum id, caso náo tenha inicia a pagina com um Id.
class localStorages{
    //A verificação se há um Id é realizado nesta parte
    constructor(){
        let pegaID = localStorage.getItem("id")

        if(pegaID === null){
            localStorage.setItem("id", 0)
        }
    }

    // Aqui é retornamos o proximo Id após o anterior ser registrado em local host
    identificaProxID(){
        let ProximoID = localStorage.getItem("id")

        return(parseInt(ProximoID) + 1)
    }

    //Aqui pegamos o Id atualizado registramos o objeto neste Id e inserimos em local host, e ao fim chamosmos a função da classe que atualiza o Id
    atualizaID_Obj(Obj){

        let ID_atualizado = this.identificaProxID()

        localStorage.setItem(ID_atualizado, JSON.stringify(Obj))

        localStorage.setItem("id", ID_atualizado)


    }
    
    //Aqui pegamos todos os registros efetuados em local host e armazemaos em uma array, para manipulaçao e ultilização desses dados.
    recuperaTodosRegistros (){

        let arrayDadosInseridos = []

        let id = localStorage.getItem("id")

        for(let i = 1; i <= id; i ++){

            let pegaDadoPorVez = JSON.parse(localStorage.getItem(i))

            if(pegaDadoPorVez == null || pegaDadoPorVez == undefined){
                continue
            }
            
            pegaDadoPorVez.id = i
            arrayDadosInseridos.push(pegaDadoPorVez)
            
        }

        //Após a recuperaçÃo de todos os objetos, retornamos a array pronta como resultado.
        return arrayDadosInseridos
    }


}

//Aqui é criado o objeto baseado no modelo de classe do bjeto.
let InseredadosLocal = new localStorages()

//Aqui é a função que cria os elementos da tabela e insere os dados recuperaddos dentro da array de objetos do local host
// para inseri-las na tabela HTML
function listaDeDados (){

    let tbody = document.getElementById("listaRendimentos")

    //todas vez que a função for chamada, faremos com que inicie tudo em branco para então sempre registrar 
    //os dados atualizados.
    tbody.innerHTML = ""

    let listaDeDados = []
    let listaDeDados_maiores = []
    let maioresDados = [] //Este vetor armazena os três maiores rendimentos
    let motivosDados = []

    listaDeDados = InseredadosLocal.recuperaTodosRegistros ()
    listaDeDados_maiores = InseredadosLocal.recuperaTodosRegistros ()

    let inicio
    let maior

    // Esta condição faz a logica paracapturar os três maiores rendimentos.
    if(listaDeDados_maiores.length <= 3){
        for(let x = 0; x < listaDeDados_maiores.length; x++){
            maioresDados.push(listaDeDados_maiores[x].valor)
            motivosDados.push(listaDeDados_maiores[x].descricao)
        }
    }
    else if(listaDeDados_maiores.length >= 4){
        for(let y = 0; y < 3; y++){
            inicio = 0

            for(let i = inicio + 1; i < listaDeDados_maiores.length; i ++){

                if(listaDeDados_maiores[inicio].valor < listaDeDados_maiores[i].valor){
                    inicio = i
                    maior = inicio
                }

            }

            maioresDados.push(listaDeDados_maiores[maior].valor)
            motivosDados.push(listaDeDados_maiores[maior].descricao)
            listaDeDados_maiores.splice(maior, 1)
        }
    }
        
    console.log(maioresDados)
    

    for (let i in listaDeDados) {

        //este loop é responsavel por inverter a data recebida nos objetos 
        let data = listaDeDados[i].data
        data = data.split("-")
        for(let i = 0; i < 1; i++){
            let a = data[i]
            let b = data[i + 1]
            let c = data[i + 2]

            data = `${c}/${b}/${a}`
        }
        //este loop é responsavel por inverter a data recebida nos objetos 
            

        //aqui inserimos a linha no tbody para determinado objeto dentro da array
        let linha = tbody.insertRow()

        //aqui inserimos aas colunas no tbody para determinado objeto dentro da array
        linha.insertCell(0).innerHTML = data;
        switch (listaDeDados[i].categoria){
            case "1" : listaDeDados[i].categoria = "Alimentação"
                break
            case "2" : listaDeDados[i].categoria = "Educação"
                break
            case "3" : listaDeDados[i].categoria = "Lazer"
                break
            case "4" : listaDeDados[i].categoria = "Saúde"
                break
            case "5" : listaDeDados[i].categoria = "Transporte"
                break
        }
        linha.insertCell(1).innerHTML = listaDeDados[i].categoria
        linha.insertCell(2).innerHTML = listaDeDados[i].descricao
        linha.insertCell(3).innerHTML = listaDeDados[i].valor

        //aqui é criado os botãos para exclusão dos registros feitos na tabela.
        let btn = document.createElement("button")
        btn.className = "btn btn-danger"
        btn.innerHTML = `<i class="fas fa-times"></i>`
        btn.id = `${listaDeDados[i].id}`

        btn.onclick= function deletaRegistro() {
            let btn_id = btn.id

            localStorage.removeItem(btn_id)

            window.location.reload()
        }

        linha.insertCell(4).append(btn)
    } 

    console.log(listaDeDados)
    console.log(tbody)

    document.getElementById('myChart').innerHTML = ''

    let ctx = document.getElementById("myChart")

    let meu_grafico = new Chart (ctx, {
        type : "bar",
        data : {
            labels : motivosDados,
            datasets: [
                {
                    label : "Maiores Rendiementos do Periodo ",
                    data : maioresDados,
                    backgroundColor : [

                        '#457b9d',
                        '#f4a261',
                        '#e9c46a',
                        '#02c39a',
                        '#c44536',
                        '#011627',
                        '#283618',
                        '#540b0e',
                        '#c9ada7',
                        '#e36414',
                        '#ce4257'
                    ],
                    borderWidth : 2,
                    width : 5


                }
            ]
        },
        options : {
            title : {
                text : "Grafico do Dados",
                display : true,
                fontSize : 25
            },
            
            scales : {
                yAxes : [
                    {
                        ticks : {
                            beginAtZero : true
                        }
                    }
                ]
            }
        }
    })

    // let meu_grafico = new Chart (ctx, {
    //     type: "bar",
    //     data:{ 
    //         labels: motivosDados,
    //         datasets: [{
    //             label: "Maiores Rendiemntos do Periodo ",
    //             data: maioresDados,
    //             borderWidth: 3,
    //             borderColor: "rgba(77,166,253,0.85)",
    //             backgroundColor: "transparent"

    //         }]

    //     }
    // })
}

// Função que pega os dados do rendimento inserido e compila em um objeto pra ser registrado em Local host
function pegaDadosRendimentos (){

    let categoria = document.getElementById("categoria").value
    let data = document.getElementById("data").value
    let descricao = document.getElementById("descricao").value
    let valor = (document.getElementById("valor").value)
    valor = valor.replace(",", ".")
    valor = parseFloat(valor)
    // console.log(valor)

    //controle automatico das divs
    let tituloModal = document.getElementById("exampleModalLabel")
    let divTextoCor = document.getElementById("estilo_Textos")
    let textoCorpo = document.getElementById("texto-corpo")
    let botao = document.getElementById("botao")

    

    //class responsavel por armarzenar os dados em forma de objeto e tambem validar os campos.
    class pegaDados {
        constructor(categoria, data, descricao, valor){

            this.categoria = categoria
            this.data = data
            this.descricao = descricao
            this.valor = valor
        }

        //Valida campos
        validacao(){
            for(let i in this){
                if(this[i] == "" || this[i] == null || this[i] == undefined) {
                    return false
                }
            }
            return true
        }
    }

    //aqui criamos o objeto baseado na lasse do objeto
    let mostraDados = new pegaDados(categoria, data, descricao, valor)

    if (mostraDados.validacao() == true){
        InseredadosLocal.atualizaID_Obj(mostraDados)
        InseredadosLocal.recuperaTodosRegistros ()
        listaDeDados ()

        divTextoCor.className = "modal-header text-success"    
        tituloModal.innerHTML = "Registro efetuado"
        textoCorpo.innerHTML =  "A despesa foi cadastrada com sucesso!"
        botao.setAttribute("class", "btn btn-success")
        botao.innerHTML = "Fechar"
        $(`#modalRegistraDespesas`).modal(`show`)

        document.getElementById("data").value = ""
        document.getElementById("categoria").value = ""
        document.getElementById("descricao").value = ""
        document.getElementById("valor").value = ""
    }else{
        divTextoCor.setAttribute("class", "modal-header text-danger") 
        tituloModal.innerHTML = "Erro na gravação"
        textoCorpo.innerHTML = "Existem campos obrigatórios que não foram preenchidos."
        botao.setAttribute("class", "btn btn-danger")
        botao.innerHTML = "Fechar"
        $(`#modalRegistraDespesas`).modal(`show`)
    }
    
    
}

//-------------------------------- Separação entre rendimentos e despesas---------------------


// Classe que ira verificar se há algum id, caso náo tenha inicia a pagina com um Id.
class localStorages_2{
    //A verificação se há um Id é realizado nesta parte
    constructor(){
        let pegaID_2 = localStorage.getItem("id_2")

        if(pegaID_2 === null){
            localStorage.setItem("id_2", -0)
        }
    }

    // Aqui é retornamos o proximo Id após o anterior ser registrado em local host
    identificaProxID_2(){
        let ProximoID_2 = localStorage.getItem("id_2")

        return(parseInt(ProximoID_2) - 1)
    }

    //Aqui pegamos o Id atualizado registramos o objeto neste Id e inserimos em local host, e ao fim chamosmos a função da classe que atualiza o Id
    atualizaID_Obj(Obj_2){
        let ID_atualizado_2 = this.identificaProxID_2()

        localStorage.setItem(ID_atualizado_2, JSON.stringify(Obj_2))

        localStorage.setItem("id_2", ID_atualizado_2)

    }
    
    //Aqui pegamos todos os registros efetuados em local host e armazemaos em uma array, para manipulaçao e ultilização desses dados.
    recuperaTodosRegistros_2 (){

        let arrayDadosInseridos_2 = []

        let id_2 = localStorage.getItem("id_2")

        for(let i = 0; i >= id_2; i --){

            let pegaDadoPorVez_2 = JSON.parse(localStorage.getItem(i))

            if(pegaDadoPorVez_2 == null || pegaDadoPorVez_2 == undefined){
                continue
            }
            
            pegaDadoPorVez_2.id = i
            arrayDadosInseridos_2.push(pegaDadoPorVez_2)
            
        }

        //Após a recuperaçÃo de todos os objetos, retornamos a array pronta como resultado.
        return arrayDadosInseridos_2
    }

}
let InseredadosLocal_2 = new localStorages_2()


//Aqui é a função que cria os elementos da tabela e insere os dados recuperaddos dentro da array de objetos do local host
// para inseri-las na tabela HTML
function listaDeDados_2 (){

    let tbody_2  = document.getElementById("listaDespesas")

    //todas vez que a função for chamada, faremos com que inicie tudo em branco para então sempre registrar 
    //os dados atualizados.
    tbody_2.innerHTML = ""

    let listaDeDados_2 = []

    listaDeDados_2 = InseredadosLocal_2.recuperaTodosRegistros_2 ()

    

    for (let i in listaDeDados_2) {


        //este loop é responsavel por inverter a data recebida nos objetos 
        let data_2 = listaDeDados_2[i].data
        data_2 = data_2.split("-")
        for(let i = 0; i < 1; i++){
            let a = data_2[i]
            let b = data_2[i + 1]
            let c = data_2[i + 2]

            data_2 = `${c}/${b}/${a}`
        }
        //este loop é responsavel por inverter a data recebida nos objetos 
            

        //aqui inserimos a linha no tbody para determinado objeto dentro da array
        let linha_2 = tbody_2.insertRow()

        //aqui inserimos aas colunas no tbody para determinado objeto dentro da array
        linha_2.insertCell(0).innerHTML = data_2;
        switch (listaDeDados_2[i].categoria){
            case "1" : listaDeDados_2[i].categoria = "Alimentação"
                break
            case "2" : listaDeDados_2[i].categoria = "Educação"
                break
            case "3" : listaDeDados_2[i].categoria = "Lazer"
                break
            case "4" : listaDeDados_2[i].categoria = "Saúde"
                break
            case "5" : listaDeDados_2[i].categoria = "Transporte"
                break
        }
        linha_2.insertCell(1).innerHTML = listaDeDados_2[i].categoria
        linha_2.insertCell(2).innerHTML = listaDeDados_2[i].descricao
        linha_2.insertCell(3).innerHTML = listaDeDados_2[i].valor

        //aqui é criado os botãos para exclusão dos registros feitos na tabela.
        let btn_2 = document.createElement("button")
        btn_2.className = "btn btn-danger"
        btn_2.innerHTML = `<i class="fas fa-times"></i>`
        btn_2.id = `${listaDeDados_2[i].id}`

        btn_2.onclick= function deletaRegistro_2() {
            let btn_id_2 = btn_2.id

            localStorage.removeItem(btn_id_2)

            window.location.reload()
        }

        linha_2.insertCell(4).append(btn_2)
    } 

    console.log(listaDeDados_2)
    console.log(tbody_2)
}



// Função que pega os dados do rendimento inserido e compila em um objeto pra ser registrado em Local host
function pegaDadosDespesas (){

    let categoria_B = document.getElementById("categoria_B").value
    let data_B = document.getElementById("data_B").value
    let descricao_B = document.getElementById("descricao_B").value
    let valor_B = document.getElementById("valor_B").value

    //controle automatico das divs
    let tituloModal = document.getElementById("exampleModalLabel")
    let divTextoCor = document.getElementById("estilo_Textos")
    let textoCorpo = document.getElementById("texto-corpo")
    let botao = document.getElementById("botao")

    console.log(categoria_B, data_B, descricao_B, valor_B)

    class pegaDespesas {
        constructor(categoria, data, descricao, valor){

            this.categoria = categoria
            this.data = data
            this.descricao = descricao
            this.valor = valor
        }

        //Valida campos
        validacao(){
            for(let i in this){
                if(this[i] == "" || this[i] == null || this[i] == undefined) {
                    return false
                }
            }
            return true
        }
    }

    //aqui criamos o objeto baseado na lasse do objeto
    let mostraDespesas = new pegaDespesas(categoria_B, data_B, descricao_B, valor_B)

    if (mostraDespesas.validacao() == true){
        InseredadosLocal_2.atualizaID_Obj(mostraDespesas)
        InseredadosLocal_2.recuperaTodosRegistros_2 ()
        listaDeDados_2 ()

        divTextoCor.className = "modal-header text-success"    
        tituloModal.innerHTML = "Registro efetuado"
        textoCorpo.innerHTML =  "A despesa foi cadastrada com sucesso!"
        botao.setAttribute("class", "btn btn-success")
        botao.innerHTML = "Fechar"
        $(`#modalRegistraDespesas`).modal(`show`)

        document.getElementById("data_B").value = ""
        document.getElementById("categoria_B").value = ""
        document.getElementById("descricao_B").value = ""
        document.getElementById("valor_B").value = ""
    }else{
        divTextoCor.setAttribute("class", "modal-header text-danger") 
        tituloModal.innerHTML = "Erro na gravação"
        textoCorpo.innerHTML = "Existem campos obrigatórios que não foram preenchidos."
        botao.setAttribute("class", "btn btn-danger")
        botao.innerHTML = "Fechar"
        $(`#modalRegistraDespesas`).modal(`show`)
    }

    
}
