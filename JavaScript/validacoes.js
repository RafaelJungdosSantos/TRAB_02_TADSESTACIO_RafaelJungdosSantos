$(function allValidar() {
    //Validando os campos geral com jquery
    $(document).ready(function () {
        Checkbox();
        Enviar();
        CPFValido();
        Letras();
        Cep();
        Mascaras();
        MaximoCaracteres();
        Senha();
    });
});

function Cep() {
    //identificando o campo
    $("#cep").blur(function () {
        var cep_code = $(this).val();
        
        //Se foi digitado um cep e apareceu o endereço, após apagar o cep ele retira os dados buscados.
        if ($("input#cep").val() == "") {
            $("input#estado").val("");
            $("input#cidade").val("");
            $("input#bairro").val("");
            $("input#endereco").val("");
        } else {
            //setando aonde os dados iram procurar o cep, puxando direto como ajax. Obs - necessita de internet.
            $.get("http://apps.widenet.com.br/busca-cep/api/cep.json", {code: cep_code},
            function (result) {
                if (result.status != 1) {
                    //caso cep nao esteja correto mensagem de cep nao encontrado e limpa o campos
                    alert(result.message + " " + cep_code || "A um erro desconhecido");
                    $("input#cep").val("");
                    $("input#estado").val("");
                    $("input#cidade").val("");
                    $("input#bairro").val("");
                    $("input#endereco").val("");
             
                }
                //setando os dados achados nos campos do form
                $("input#cep").val(result.code);
                $("input#estado").val(result.state);
                $("input#cidade").val(result.city);
                $("input#bairro").val(result.district);
                $("input#endereco").val(result.address);







            });
        }
    });
}
;
function destacarLinha() {
    $('table#tblList tbody tr').hover(
            function () {
                $(this).addClass('destaque');
            },
            function () {
                $(this).removeClass('destaque');
            }
    );
}
//Mascaras CEP, CPF e Telefone
function Mascaras() {
    $("#cep").mask('00000-000');
    $("#cpf").mask('000.000.000-00');
    $("#telefone").mask('(00) 0000-0000');
}
//Função para enviar a tabela
function Enviar() {
    var operacao = "A";
    var posicao = -1;
    var tblList = localStorage.getItem("Dados");
    tblList = JSON.parse(tblList);
    if (tblList == null)
        tblList = [];
    $("#formCadastro").on("submit", function () {
        if (operacao == "A")
            adicionarElemento();
        else
            editarCadastro();
    });

    function GetCliente(propriedade, valor) {
        var cli = null;
        for (var item in tblList) {
            var i = JSON.parse(tblList[item]);
            if (i[propriedade] == valor)
                cli = i;
        }
        return cli;
    }

    function adicionarElemento() {
        var cli = GetCliente("cpf", $("#cpf").val());
        if (cli !== null) {
            window.alert("CPF j\u00e1 cadastrado, Por favor digite outro - " + cli.cpf);
            $("#cpf").val("");
            $("#cpf").focus();
            return;
        } else {
            var cliente = JSON.stringify({
                cpf: $("#cpf").val(),
                nome: $("#nome").val(),
                estadoCivil: $("#estadoCivil").val(),
                sexo: $("#sexo").val(),
                telefone: $("#telefone").val(),
                cep: $("#cep").val(),
                endereco: $("#endereco").val(),
                bairro: $("#bairro").val(),
                estado: $("#estado").val(),
                cidade: $("#cidade").val(),
                email: $("#email").val(),
                senha: $("#senha").val(),
                obs: $("#obs").val(),
                rPromocao: $("#rPromocao").is(":checked")
            });
            tblList.push(cliente);
            localStorage.setItem("Dados", JSON.stringify(tblList));
            alert("Os dados foram adicionados com sucesso!!!");
            return true;

        }
    }


    function editarCadastro() {
        tblList[posicao] = JSON.stringify({
            cpf: $("#cpf").val(),
            nome: $("#nome").val(),
            estadoCivil: $("#estadoCivil").val(),
            sexo: $("#sexo").val(),
            telefone: $("#telefone").val(),
            cep: $("#cep").val(),
            endereco: $("#endereco").val(),
            bairro: $("#bairro").val(),
            estado: $("#estado").val(),
            cidade: $("#cidade").val(),
            email: $("#email").val(),
            senha: $("#senha").val(),
            obs: $("#obs").val(),
            rPromocao: $("#rPromocao").is(":checked")
        });
        localStorage.setItem("Dados", JSON.stringify(tblList));
        alert("Os dados foram cadastrados");
        operacao = "E";
        listar();
        return true;
    }
    function excluir() {
        tblList.splice(posicao, 1);
        localStorage.setItem("Dados", JSON.stringify(tblList));
    }

    function listar() {
        $("#tblDados").html("");
        for (var i in tblList) {
            var cli = JSON.parse(tblList[i]);
            $('#tblList').find('tbody').append('<tr>' +
                    '<th>' + cli.cpf + '</th>' +
                    '<th>' + cli.nome + '</th>' +
                    '<td><img src="img/edit.png"  alt = " ' + i + ' " id="btnEditar" class="btnEditar"  />   ' +
                    '<img src="img/delete.png"  alt = " ' + i + ' " id="btnExcluir" class="btnRemover"  />' +
                    '</tr>');
            destacarLinha();
            limpar();
        }
    }


    $("#tblList").on("click", "#btnEditar", function () {
        operacao = "E";
        posicao = parseInt($(this).attr("alt"));

        var cli = JSON.parse(tblList[posicao]);
        $("#cpf").val(cli.cpf);
        $("#nome").val(cli.nome);
        $("#estadoCivil").val(cli.estadoCivil);
        $("#sexo").val(cli.sexo);
        $("#telefone").val(cli.telefone);
        $("#cep").val(cli.cep);
        $("#endereco").val(cli.endereco);
        $("#bairro").val(cli.bairro);
        $("#estado").val(cli.estado);
        $("#cidade").val(cli.cidade);
        $("#email").val(cli.email);
        $("#senha").val(cli.senha);
        $("#obs").val(cli.obs);
        $('#rPromocao').attr('checked', cli.rPromocao);
        $("#nome").focus();
        verificaCheck();

    });

    $("#tblList").on("click", "#btnExcluir", function () {
        posicao = parseInt($(this).attr("alt"));
        if (window.confirm(' Deseja realmente excluir? ')) {
            excluir();
            listar();
        }
        else {
            return false;
        }
    });


    //Função cancelar
    $("#cancelar").click(function () {
        //checando se esta marcado, se estiver marcado ira desmarcar e esconder a mensagem ao cancelar
        if ($("#rPromocao").is(":checked")) {
            $("#mensagem").hide();
            $('#rPromocao').attr('checked', false);
        } else {
            $("#mensagem").hide();
            $('#rPromocao').attr('checked', false);
        }
        limpar();
        operacao = "A";
    });
    listar();
}
//Campo limpar, onde apaga tudo oque foi digitado
function limpar() {
    //limparndo tudo do form
    $('#cpf').val('');
    $('#nome').val('');
    $('#estadoCivil').val('');
    $('#sexo').val('');
    $('#telefone').val('');
    $('#cep').val('');
    $('#endereco').val('');
    $('#bairro').val('');
    $('#estado').val('');
    $('#cidade').val('');
    $('#email').val('');
    $('#senha').val('');
    $('#obs').val('');
    $('#rPromocao').val('');


}
//Validação das letras
function Letras() {
    $("#nome").keypress(function (event) {
        //Recebe o valor da tecla pressionada
        var tecla = event.keyCode || event.which;
        //Somente as letras minusculas, maisculas e o espaço
        if ((tecla >= 65 && tecla <= 90 || tecla >= 97 && tecla <= 122 || tecla == 32))
            return true;
        else {
            //apagar e esc liberados
            if (tecla == 8 || tecla == 0)
                return true;
            else
                return false;
        }
    });
}

//Validação para apenas CPF validos
function CPFValido() {
    //evento change do campo cpf
    $("#cpf").blur(function () {
        var cpf = $("#cpf").val();
        if (cpf <= 0)
            return;
        var filtro = /^\d{3}.\d{3}.\d{3}-\d{2}$/i;
        if (!filtro.test(cpf)) {
            window.alert("CPF Invalido");
            $("#cpf").focus();
            $("#cpf").val("");
            return;
        }
        cpf = remove(cpf, ".");
        cpf = remove(cpf, "-");
        if (cpf.length != 11 ||
                cpf == "00000000000" ||
                cpf == "11111111111" ||
                cpf == "22222222222" ||
                cpf == "33333333333" ||
                cpf == "44444444444" ||
                cpf == "55555555555" ||
                cpf == "66666666666" ||
                cpf == "77777777777" ||
                cpf == "88888888888" ||
                cpf == "99999999999") {
            window.alert("CPF Invalido");
            $("#cpf").focus();
            $("#cpf").val("");
            return;
        }
        //verifica o primeiro digito
        soma = 0;
        for (i = 0; i < 9; i++)
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        resto = 11 - (soma % 11);
        if (resto == 10 || resto == 11)
            resto = 0;
        if (resto != parseInt(cpf.charAt(9))) {
            window.alert("CPF Invalido");
            $("#cpf").focus();
            $("#cpf").val("");
            return;
        }
        //verifica primeiro digito e o segundo
        soma = 0;
        for (i = 0; i < 10; i ++)
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        resto = 11 - (soma % 11);
        if (resto == 10 || resto == 11)
            resto = 0;
        if (resto != parseInt(cpf.charAt(10))) {
            window.alert("CPF Invalido");
            $("#cpf").focus();
            $("#cpf").val("");
            return;
        }
        return true;

    });
    //Pontos e traço do numero de cpf são removidos antes de fazer a verificar
    function remove(str, sub) {
        i = str.indexOf(sub);
        r = "";
        if (i == -1)
            return str;
        r += str.substring(0, i) + remove(str.substring(i + sub.length), sub);
        return r;
    }
}
//Validação para senha
function Senha() {
    $("#senha").keypress(function (event) {
        //Recebe o valor da tecla pressionada
        var tecla = event.keyCode || event.which;
        //Apenas letras minusculas, maisculas e os numeros
        if ((tecla >= 65 && tecla <= 90 || tecla >= 97 && tecla <= 122 || tecla >= 48 && tecla <= 57))
            return true;
        else {
            //apagar e esc liberados
            if (tecla == 8 || tecla == 0)
                return true;
            else
                return false;
        }
    });
}
//Validação maximo de caracteres permitidos no campo Observação
function MaximoCaracteres() {
    //evento keypress do campo obs
    $("#obs").keypress(function (event) {
        //verifica se tem mais do que 200 caracteres
        if (formCadastro.obs.value.length == 200) {
            alert("O Campo observação deve conter no maximo 200 caracteres.");
            //nao deixa digitar mais que 200 caracteres
            event.preventDefault();
            formCadastro.obs.focus();
            return false;
        }
    });
}
//Validação do campo CheckBox
function Checkbox() {
    //evento verifica ao clicar no checkbox
    $("#rPromocao").on("change", function () {
        verificaCheck();
    });
}
//Verifica o checkbox para aparecer a mensagem quando marcado, e tirar a mensagem quando desmarcado
function verificaCheck() {
    if ($("#rPromocao").is(":checked")) {
        $("#mensagem").show();
    } else
        $("#mensagem").hide();
}
