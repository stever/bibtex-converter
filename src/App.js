import React from "react";
import {Citation} from "./component/Citation";
import 'bootstrap/scss/bootstrap.scss'
import './style.css'

function App() {
  return (
    <div className="App">
        <main className="p-3 bg-light">
            <center><b>References</b></center>
            <Citation number={1} input={`@book{texbook,
  author = {Donald E. Knuth},
  year = {1986},
  title = {The {\\TeX} Book},
  publisher = {Addison-Wesley Professional}
}`}/>
            <Citation number={2} input={`@book{latex:companion,
  author = {Frank Mittelbach and Michel Gossens
            and Johannes Braams and David Carlisle
            and Chris Rowley},
  year = {2004},
  title = {The {\\LaTeX} Companion},
  publisher = {Addison-Wesley Professional},
  edition = {2}
}`}/>
            <Citation number={3} input={`@book{latex2e,
  author = {Leslie Lamport},
  year = {1994},
  title = {{\\LaTeX}: a Document Preparation System},
  publisher = {Addison Wesley},
  address = {Massachusetts},
  edition = {2}
}`}/>
            <Citation number={4} input={`@article{knuth:1984,
  title={Literate Programming},
  author={Donald E. Knuth},
  journal={The Computer Journal},
  volume={27},
  number={2},
  pages={97--111},
  year={1984},
  publisher={Oxford University Press}
}`}/>
            <Citation number={5} input={`@inproceedings{lesk:1977,
  title={Computer Typesetting of Technical Journals on {UNIX}},
  author={Michael Lesk and Brian Kernighan},
  booktitle={Proceedings of American Federation of
             Information Processing Societies: 1977
             National Computer Conference},
  pages={879--888},
  year={1977},
  address={Dallas, Texas}
}`}/>
        </main>
    </div>
  );
}

export default App;
