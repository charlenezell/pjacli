{{#block "sprites"}}
{{#each sprites}}
@mixin {{{strings.name}}}_new($mw:null,$mh:null) {
  background-image: url({{{escaped_image}}});
  width: {{px.width}};
  height: {{px.height}};
  @if $mw != null {
      width: $mw;
      height: ($mw*({{height}}/{{width}}));
  }
  @if $mh != null {
      width: ($mh*({{width}}/{{height}}));
      height:$mh;
  }
  @include bgp_new({{width}},{{height}},{{x}},{{y}},{{total_width}},{{total_height}});
}
@mixin {{{strings.name}}}($mw:null,$mh:null) {
  background-image: url({{{escaped_image}}});
  width: {{px.width}};
  height: {{px.height}};
  @if $mw != null {
    @include when(mobile){
      width: $mw;
      height: ($mw*({{height}}/{{width}}));
    }
  }
  @if $mh != null {
    @include when(mobile){
      width: ($mh*({{width}}/{{height}}));
      height:$mh;
    }
  }
  @include bgp({{width}},{{height}},{{x}},{{y}},{{total_width}},{{total_height}});
}

@function  {{{strings.name}}}_inspect($key:null) {
  $ix:{{px.offset_x}};
  $x:{{x}};
  $y:{{y}};
  $iy:{{px.offset_y}};
  $iw:{{px.width}};
  $ih:{{px.height}};
  $width:{{width}};
  $height:{{height}};
  $img:"{{{escaped_image}}}";
  $totalWidth:{{total_width}};
  $totalHeight:{{total_height}};
  @if $key{
    @return map-get((px_height:$ih,px_width:$iw,px_x:$ix,px_y:$iy,img:$img,totalHeight:$totalHeight,totalWidth:$totalWidth,x:$x,y:$y,width:$width,height:$height),$key);
  }@else{
    @return (px_height:$ih,px_width:$iw,px_x:$ix,px_y:$iy,img:$img,totalHeight:$totalHeight,totalWidth:$totalWidth,x:$x,y:$y,width:$width,height:$height);
  }

}

{{/each}}
{{/block}}
