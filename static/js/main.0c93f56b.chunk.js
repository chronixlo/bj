(this.webpackJsonpbj=this.webpackJsonpbj||[]).push([[0],{30:function(e,n,a){},37:function(e,n,a){"use strict";a.r(n);var c=a(12),t=a.n(c),s=a(20),i=a.n(s),l=(a(30),a(25)),r=a(24),o=a(0);function d(e){var n=e.handValue,a=e.enemyHandValue,c=e.cards,t=e.mirror,s=e.gameStatus,i=n>21?"hand-losing":a>21||n>a?"hand-winning":n<a?"hand-losing":"";return Object(o.jsxs)("div",{className:"hand "+(t?"hand-mirror":""),children:[Object(o.jsxs)("div",{className:"hand-value "+i,children:[n,"FINISHED"===s&&"hand-winning"===i&&Object(o.jsx)("span",{className:"result-icon",children:"\ud83c\udfc6"})]}),Object(o.jsx)("div",{className:"cards",children:c.map((function(e,n){return Object(o.jsxs)("div",{className:"card card-"+e.suit.symbol,children:[Object(o.jsxs)("div",{className:"card-face",children:[Object(o.jsxs)("div",{className:"card-face-top",children:[Object(o.jsx)("div",{children:e.rank.symbol}),Object(o.jsx)("div",{className:"emoji",children:e.suit.symbol})]}),Object(o.jsxs)("div",{className:"card-face-bottom",children:[Object(o.jsx)("div",{children:e.rank.symbol}),Object(o.jsx)("div",{className:"emoji",children:e.suit.symbol})]}),Object(o.jsx)("div",{className:"card-face-inner",children:new Array(e.rank.value).fill().map((function(n,a){return Object(o.jsx)("div",{className:"emoji",children:e.suit.symbol},a)}))})]}),Object(o.jsx)("div",{className:"card-back",children:Object(o.jsx)("div",{className:"card-back-inner"})})]},n)}))})]})}function u(e){var n=e.wins,a=e.roundsToWin;return Object(o.jsx)("div",{className:"round-wins",children:new Array(a).fill().map((function(e,a){return Object(o.jsx)("div",{className:"round "+(n>a?"round-won":"")},a)}))})}for(var j=[],b=[{id:"HEART",symbol:"\u2665"},{id:"DIAMOND",symbol:"\u2666"},{id:"SPADE",symbol:"\u2660"},{id:"CLUB",symbol:"\u2663"}],m=[{symbol:"2",value:2},{symbol:"3",value:3},{symbol:"4",value:4},{symbol:"5",value:5},{symbol:"6",value:6},{symbol:"7",value:7},{symbol:"8",value:8},{symbol:"9",value:9},{symbol:"10",value:10},{symbol:"J",value:10},{symbol:"Q",value:10},{symbol:"K",value:10},{symbol:"A",value:1}],v=0;v<52;v++)j.push({suit:b[v%4],rank:m[Math.floor(v/4)]});var h=function(e){return e.reduce((function(e,n){return e+n.rank.value}),0)},O=navigator.userAgent.match(/iphone|ipad|android|macintosh/i);function y(){var e,n,a,t,s=Object(c.useState)(),i=Object(l.a)(s,2),j=i[0],b=i[1],m=Object(c.useMemo)((function(){return(null===j||void 0===j?void 0:j.player1)&&h(j.player1.hand)}),[null===j||void 0===j?void 0:j.player1]),v=Object(c.useMemo)((function(){return(null===j||void 0===j?void 0:j.player2)&&h(j.player2.hand)}),[null===j||void 0===j?void 0:j.player2]),y=Object(c.useRef)();return Object(c.useEffect)((function(){var e=y.current=Object(r.a)("https://bj-1v1.herokuapp.com");e.on("connect",(function(n){var a=window.location.search.slice(1);a?e.emit("join_game",{gameId:a}):e.emit("create_game",{})})),e.on("join",(function(e){b(e),window.history.replaceState(null,null,"./?"+e.gameId)})),e.on("player_join",(function(e){b(e)})),e.on("terminated",(function(e){})),e.on("not_found",(function(n){window.history.replaceState(null,null,"./"),e.emit("create_game",{})})),e.on("update",(function(e){b(e)}))}),[]),j?Object(o.jsx)("div",{className:"app "+(O?"small-emojis":""),children:Object(o.jsxs)("div",{className:"app-inner",children:[Object(o.jsx)("div",{className:"player-portrait",children:"ENEMY"}),Object(o.jsx)(u,{wins:(null===(e=j.player2)||void 0===e?void 0:e.score)||0,roundsToWin:j.roundsToWin}),Object(o.jsx)(d,{cards:(null===(n=j.player2)||void 0===n?void 0:n.hand)||[],handValue:v,enemyHandValue:m,mirror:!0,gameStatus:j.status}),Object(o.jsxs)("div",{className:"divider",children:[Object(o.jsx)("div",{}),Object(o.jsx)("div",{style:{flex:1}}),Object(o.jsxs)("div",{children:[Object(o.jsx)("div",{className:"card",children:Object(o.jsx)("div",{className:"card-back no-anim",children:Object(o.jsx)("div",{className:"card-back-inner"})})}),Object(o.jsx)("div",{children:j.deckSize-j.deckIndex})]})]}),Object(o.jsx)(d,{cards:(null===(a=j.player1)||void 0===a?void 0:a.hand)||[],handValue:m,enemyHandValue:v,gameStatus:j.status}),Object(o.jsx)(u,{wins:(null===(t=j.player1)||void 0===t?void 0:t.score)||0,roundsToWin:j.roundsToWin}),Object(o.jsx)("div",{className:"player-portrait",children:Object(o.jsxs)("div",{className:"actions",children:["PLAYER1_TURN"===j.status&&Object(o.jsxs)(o.Fragment,{children:[Object(o.jsx)("button",{className:"action-button hit",onClick:function(){y.current.emit("hit")},children:"HIT"}),Object(o.jsx)("button",{className:"action-button stay",onClick:function(){y.current.emit("stay")},children:"STAY"})]}),"FINISHED"===j.status&&Object(o.jsx)(o.Fragment,{children:Object(o.jsx)("button",{className:"action-button",onClick:function(){y.current.emit("next_round")},children:"NEXT ROUND"})}),"GAME_OVER"===j.status&&Object(o.jsx)(o.Fragment,{children:Object(o.jsx)("button",{className:"action-button",onClick:function(){y.current.emit("create_game")},children:"NEW GAME"})})]})})]})}):null}var x=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,38)).then((function(n){var a=n.getCLS,c=n.getFID,t=n.getFCP,s=n.getLCP,i=n.getTTFB;a(e),c(e),t(e),s(e),i(e)}))};document.body.style.background="center / cover no-repeat url(./bg.jpg)",i.a.render(Object(o.jsx)(t.a.StrictMode,{children:Object(o.jsx)(y,{})}),document.getElementById("root")),x()}},[[37,1,2]]]);
//# sourceMappingURL=main.0c93f56b.chunk.js.map