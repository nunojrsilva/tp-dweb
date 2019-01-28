$(()=>{

	var fileInputs = 0;
	var item = 1;
	var tipo = "opiniao"

	$('#formDiv').load('http://localhost:3000/pubs/opiniaoPub')

	$('input:file').bind('change', function() {
		if (this.files[0].size > 200*1024*1024) {
			alert("Tamanho do ficheiro excedeu o limite de 200MB");
			$('#myForm').trigger("reset");
		}
	})

	$("#AdicaoFicheiros").click(e =>{
		e.preventDefault()

		$('#AdicaoFicheiros').css('visibility', 'hidden')
		$('#filesDiv').css('visibility', 'visible')
	})

	$("#cancelarAdicaoFicheiros").click(e =>{
		e.preventDefault()

		$('.moreFiles').remove();
		$('#filesDiv').find('input:text').val('');
		$('#filesDiv').find('input:file').val('');
		$('#filesDiv').css('visibility', 'hidden')
		$('#AdicaoFicheiros').css('visibility', 'visible')
	})

	$("#publica").click(e =>{

		$('#publica').prop('checked', true)
		$('#seguidores').prop('checked', false)
		$('#privada').prop('checked', false)
	})

	$("#seguidores").click(e =>{

		$('#publica').prop('checked', false)
		$('#seguidores').prop('checked', true)
		$('#privada').prop('checked', false)
	})

	$("#privada").click(e =>{

		$('#publica').prop('checked', false)
		$('#seguidores').prop('checked', false)
		$('#privada').prop('checked', true)
	})

	$("#formDiv").on("click", "#adicionarIten", () => {

        item = item + 1
 
        var input = $("<input class='w3-input w3-border w3-round-large' id='item" + item + "' style='width:100%; margin-top:2px;' type='text' placeholder='Item da Lista'>");
        $("#listaItens").append(input)
      
	})

    $("#more_files").click(e => {
		e.preventDefault()

		fileInputs = fileInputs + 1
 
		var input = $("<input type='file' class='w3-input w3-border w3-round-large w3-white moreFiles' name='file" + fileInputs + "' multiple/>");
		$("#listaFiles").append(input);
	})

	$("#opiniaobtn").click(e=>{
		tipo = "opiniao"
		$('#formDiv').load('http://localhost:3000/pubs/opiniaoPub')
		$('#formPub').css('display', '');
		$('#formPubHidden').css('display', 'none');
	})

	$("#narracaobtn").click(e=>{
		tipo = "narracao"
		$('#formDiv').load('http://localhost:3000/pubs/narracaoPub')
		$('#formPubHidden').css('display', 'none');
		$('#formPub').css('display', '');
	})

	$("#listabtn").click(e=>{
		tipo = "lista"
		$('#formDiv').load('http://localhost:3000/pubs/listaPub')
		$('#formPubHidden').css('display', 'none');
		$('#formPub').css('display', '');
	})

	$("#eventobtn").click(e=>{
		tipo = "evento"
		$('#formDiv').load('http://localhost:3000/pubs/eventoPub')
		$('#formPubHidden').css('display', 'none');
		$('#formPub').css('display', '');
	})

	$("#fecharForm").click(e=>{
		tipo = "opiniao"
		$("#cancelarAdicaoFicheiros").click()
		$('#formDiv').load('http://localhost:3000/pubs/eventoPub')
		$('#formPubHidden').css('display', '');
		$('#formPub').css('display', 'none');
		$('#myForm').trigger("reset");
	})


	$('#formPub').submit(function(e){
		e.preventDefault();
		//alert('Entrei')
					
		var formData = new FormData();
		var aux=1;
        var linha = "";

		$.each($("input[type=file]"), function(i, obj) {
			$.each(obj.files,function(j, file){
				formData.append('file'+aux, file);
				aux++;
			})
		});		
		formData.append('fileTitle', $('#filesTitulo').val());
		//alert('Cheguei ao 1')

		if(tipo == "opiniao")
			if($('#opiniao').val())
				formData.append('opiniao', $('#opiniao').val());
			else if($('#fileBase').val()) {
				tipo = "ficheiros"
			} else {
				alert("Insira uma opinião ou no mínimo um ficheiro")
				return;
			}


		if(tipo == "narracao"){
			formData.append('titulo', $('#titulo').val());
			formData.append('texto', $('#texto').val());
			formData.append('autor', $('#autor').val());
		}
		
		if(tipo == "lista"){
			formData.append('titulo', $('#titulo').val());

			for(aux = 1; aux <= item; aux++){
				linha = $("#item" + aux).val()
				if(linha != undefined){
					if (linha != ""){
						formData.append('item'+aux, linha)
					}
				}
				else console.log("ERA UNDEFINED", aux)
			}
		}

		if(tipo == "evento"){
			formData.append('titulo', $('#titulo').val());
			formData.append('atividade', $('#atividade').val());
			formData.append('duracao', $('#duracao').val());
			formData.append('descricao', $('#descricao').val());
			formData.append('data', $('#data').val());
		}

		//alert('Cheguei ao 2')

		if(document.getElementById('publica').checked)
			formData.append('privacidade', "publica");
		else{
			if(document.getElementById('seguidores').checked)
				formData.append('privacidade', "seguidores");
			else
				formData.append('privacidade', "privada");
		}
		//alert('Cheguei ao 3')

		$.ajax({
			url:'/pubs/'+tipo,
			type:"POST",
			contentType: "application/json",
			data:formData,
			success: data =>{
				console.log(data)
				alert('Publicação efetuada com sucesso');
				$('#listaPublicacoes').prepend(data);
				$("#fecharForm").click();
			},
			error: e =>{
				$('#myForm').trigger("reset");
				console.log('Erro no post: ' + JSON.stringify(e))
			},
			cache: false,
			contentType: false,
			processData: false
		});
	});
});