$(() => {
    
   $("#adicionarLinha").click(e => {
       e.preventDefault()

       var input = $("<input class=\"w3-input\" name=\"item\" type=\"text\" placeholder=\"Item da Lista\">");
       $("#lista").append(input)
     
   })

  

})

