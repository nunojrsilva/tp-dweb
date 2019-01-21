$(() => {

    var item = 1;
    
   $("#adicionarLinha").click(e => {
       e.preventDefault()
       item = item + 1

       var input = $("<input class=\"w3-input\" name=\"item" + item + "\" type=\"text\" placeholder=\"Item da Lista\">");
       $("#inputs").append(input)
     
   })

  

})

