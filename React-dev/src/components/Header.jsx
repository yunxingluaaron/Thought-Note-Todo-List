import React from "react";
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';

function Header() {
return <header>
{/* <h1><EmojiObjectsIcon />Thought</h1>
<a href="/logout" role="button">Log Out</a> */}
<div class="row">
<div class="column">
<h1><EmojiObjectsIcon />Thought</h1>
</div>
<div class="column">
<a class="column" href="/logout" role="button">Log Out</a>
</div>
</div>
    
</header>

}

export default Header;
