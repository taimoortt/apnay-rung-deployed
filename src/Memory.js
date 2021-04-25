import React from "react";
import "./styles.css";
// import Navbar from "./Navbar";
import { Link } from "react-router-dom";

const Memory = (props, panel) => {
  let panel_string = ``
  try{
    panel = props.panel.split(" ").join("");
    panel_string = `/${panel}`;
  }catch{
    panel_string = ``;
  }


  let current_string = "";
  try {
    let current = props.current.split(" ").join("");
    current_string = `/${current}`;
  } catch {
    current_string = "";
  }

  const middlePages = () => {
    let pages_array = [];
    let display_pages=[];
    try {
      let page = props.page.split(" ").join("");
      // console.log(page);
      pages_array = page.split("/");
      // page_string = `/${page}`;
      display_pages = props.page.split("/");
    } catch {
    }
    console.log(pages_array);
    return pages_array.map((element, index) => {
      let page_string = `/${element}`;
      // console.log(page_string);
      return (
        <span>
          {element !== "" ? <Link to={page_string}><a>/{display_pages[index]}</a></Link> : null}
        </span>
      );
    });
  };
  return (
    <div className="memory">
      <span>
        <Link to={panel_string}>{props.panel}</Link>
      </span>
      {middlePages()}
      {current_string !== "" ? (
        <span className="current-page">
          <Link to={current_string}>/{props.current}</Link>
        </span>
      ) : null}
    </div>
  );
};

export default Memory;

// {/* {page_string !== "" ? <Link to={page_string}>/{props.page}</Link> : null} */}
