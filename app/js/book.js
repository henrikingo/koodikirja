define(["whenInView", "turtleDiagram", "turtleFake", "os", "feedback", "jquery", "bacon.jquery"], 
function(whenInView) {
  $(function() {
    $("a").filter(function() { return $(this).attr("href").indexOf("http") >= 0 })
      .attr("target", "_blank")
    $("blockquote").each(function() {
      whenInView($(this), function(visible) {
        this.toggleClass("translucent", !visible)
      })
    })
  })
})
