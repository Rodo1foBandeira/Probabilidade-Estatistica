$('#modalGerarDados').on('hide.bs.modal', function(e){
    $('#modalGerarDados input').val('');
});

var index = {
    dados: [],
    gerarDados: function () {
        $('#dados').val('');
        var nElementos = parseInt($('#modalGerarDados #nElem').val());
        var minimo = parseInt($('#modalGerarDados #minimo').val());
        var maximo = parseInt($('#modalGerarDados #maximo').val());
        for (i = 0; i < nElementos; i++){
            var valorRandom = Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
            var valorAtual = $('#dados').val();
            $('#dados').val(valorAtual + ' ' + valorRandom);
        }
        $('#dados').val($('#dados').val().trim());
        $('#modalGerarDados').modal('hide');
    },
    executar: function () {
        $('#tabelaDistribuicao tbody tr').remove()
        // Cria vetor com base na separaçao dos espaços
        var dados = $('#dados').val().split(' ');
        // Campo ROL recebe o vetor ordenado
        $('#rol').val(dados.sort(function(a,b) { return a - b; }));
        $('#divRol').show();
        // Converte para inteiros e ordena
        var rol = dados.map(function(item) {
            return parseInt(item);
        }).sort(function(a,b) { return a - b; });
        var distribuicaoFrequencia = this.gerarDistribuicaoFrequecia(rol); // Vetor: conterá indices(classes) com lista de valores do intervalo da classe
        $.each(distribuicaoFrequencia, function (indice, item) {
            $tdClasses = $('<td>').html(indice);
            $tdIntervalo = $('<td>').html(item.intervalo.limInferior+' |- '+item.intervalo.limSuperior);
            $td_f = $('<td>').html(item.f.length+' *').attr('title',item.f).css('cursor','pointer');
            $td_fr = $('<td>').html(parseFloat(Math.round(item.fr * 100) / 100).toFixed(2));
            $td_F = $('<td>').html(item.F);
            $td_Fr = $('<td>').html(parseFloat(Math.round(item.Fr * 100) / 100).toFixed(2));
            $tr = $('<tr>');
            $tr.append($tdClasses).append($tdIntervalo).append($td_f).append($td_fr).append($td_F).append($td_Fr);
            $('#tabelaDistribuicao tbody').append($tr);
            $('[data-toggle="tooltip"]').tooltip();
        });
    },
    arredondarDecimalParaInteiroSuperior: function (valor) {
        var inteiro = parseInt(valor);
        // Se inteiro < valor então(?) inteiro + 1 senão(:) inteiro
        return inteiro < valor ? inteiro + 1 : inteiro;
    },
    calcular_Intervalo: function (rol, classes) {
        var valorMin = Math.min.apply(null, rol);
        var valorMax = Math.max.apply(null, rol);
        var intervalo = (valorMax - valorMin) / classes;
        intervalo = this.arredondarDecimalParaInteiroSuperior(intervalo);
        // Se for verdade, o ultimo limite superior vai ser igual ao valor maximo
        if (classes * intervalo + valorMin == valorMax)
            intervalo++; // Entao incrementa para resolver o problema
        return intervalo;
    },
    gerarDistribuicaoFrequecia: function (rol) {
        var nElementos = rol.length;
        // Raiz quadrada
        var classes = Math.sqrt(nElementos); // K
        classes = this.arredondarDecimalParaInteiroSuperior(classes);
        var intervalo = this.calcular_Intervalo(rol, classes); // h
        var listaClasses = []; // Vetor
        var limInferior = Math.min.apply(null, rol); // inicia com valor minimo
        var limSuperior = limInferior + intervalo;
        for (classe = 0; classe < classes; classe++){
            listaClasses.push([]);
            listaClasses[classe].intervalo = {limInferior: limInferior, limSuperior: limSuperior};
            // f receberá os valores do intervalo
            listaClasses[classe].f = rol.filter(function (item) {
                return item >= limInferior && item < limSuperior;
            });

            listaClasses[classe].fr = listaClasses[classe].f.length / nElementos * 100;
            if (classe > 0)
                listaClasses[classe].F = listaClasses[classe-1].F + listaClasses[classe].f.length
            else
                listaClasses[classe].F = listaClasses[classe].f.length;

            listaClasses[classe].Fr = listaClasses[classe].F / nElementos * 100;
            limInferior = limSuperior
            limSuperior = limSuperior + intervalo;
            if (listaClasses[classe].Fr == 100)
                classe = classes;
        }
        return listaClasses;
    }
}