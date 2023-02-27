import React from "react";
import {Citation} from "./component/Citation";
import 'bootstrap/scss/bootstrap.scss'
import './fonts.css'

function App() {
  return (
    <div className="App">
        <main className="p-3 bg-light">
            <Citation input={`@book{texbook,
  author = {Donald E. Knuth},
  year = {1986},
  title = {The {\\TeX} Book},
  publisher = {Addison-Wesley Professional}
}`}/>
        </main>
    </div>
  );
}

export default App;
