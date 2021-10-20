//Carregar dados dinâmicos (AJAX)
var ajax = new XMLHttpRequest();

ajax.open("GET", "./dados.json", true);

ajax.send();

ajax.onreadystatechange = function(){

    var content = document.getElementById("content");

    if(ajax.readyState == 4 && ajax.status == 200){

        var data_json =  JSON.parse(ajax.responseText);

        if(data_json.length == 0){

            content.innerHTML = '<div class="alert alert-warning" role="alert">Nenhuma moeda cadastrada.</div>';

        }else{
            var html_content = "";

            for(var i = 0; i <data_json.length; i++){

                html_content += '<div class="row title_cat"><div class="col-12"><h2>'+data_json[i].cargo+'</h2></div></div><div class="row">';

                if(data_json[i].moeda.length == 0){
                    html_content += '<div class="col-12"><div class="alert alert-warning" role="alert">Nenhuma moeda cadastrada.</div></div>';
                }else{
                    
                    for(var j = 0; j < data_json[i].moeda.length; j++){
                        html_content += card_moeda(data_json[i].moeda[j].nome,data_json[i].moeda[j].imagem,data_json[i].moeda[j].posicao,data_json[i].moeda[j].url_home);
                    }

                }

                html_content +="</div>";
            }
            cache_dinamico(data_json);
            content.innerHTML = html_content;
        }
    }
}

var card_moeda = function(nome, imagem, posicao, url_home){


    return '<div class="col-md-4">'+       
                '<div class="card">'+
                    '<img src="'+imagem+'" class="img_profile">'+
                    '<h5 class="card-header">'+nome+'</h5>'+
                    '<div class="card-body" style="text-align: center;">'+
                        '<h5 class="card-title">'+posicao+'</h5>'+
                        '<p class="card-text">Bora minerar!</p>'+
                        '<a href="'+url_home+'" target="_blank" class="btn btn-info">Projeto</a>'+
                    '</div>'+
                '</div>'+
            '</div>';

}


//Cache Dinâmico

var cache_dinamico = function(data_json){

    if('caches' in window){

        caches.delete('connect-app-dinamico').then(function(){

            if(data_json.length > 0){

                var files = ['dados.json'];

                for(var i = 0; i <data_json.length; i++){
                    for(var j = 0; j < data_json[i].moeda.length; j++){

                        if(files.indexOf(data_json[i].moeda[j].imagem) == -1){
                            files.push(data_json[i].moeda[j].imagem);
                        }
                    
                    }
                }

            }

            caches.open('connect-app-dinamico').then(function (cache){

                cache.addAll(files).then(function(){

                    console.log("Cache dinâmico realizado com sucesso!");

                });

            });

        });

    }
}

//Interceptar o Prompt de Instalação do PWA

let disparoInstalacao = null;
const btInstall = document.getElementById('btInstall');

let inicializarInstalacao = function(){

    btInstall.removeAttribute("hidden");
    btInstall.addEventListener("click", function(){

        disparoInstalacao.prompt();

        disparoInstalacao.userChoice.then((choice) => {

            if(choice.outcome === 'accepted'){
                console.log("Usuário fez a instalação");
            }else{
                console.log("Usuário NÃO fez a instalação");
            }

        });

    });

}
window.addEventListener('beforeinstallprompt', gravarDisparo);

function gravarDisparo(evt){
    disparoInstalacao = evt;
}