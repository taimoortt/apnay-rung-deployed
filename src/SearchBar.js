import "./styles.css";

const SearchBar = () => {
  return (
    <div>
      <div class="input-group mb-3">
        {" "}
        <input type="text" class="form-control"></input>
        <div class="input-group-append">
          <button class="btn btn-primary">
            <i class="fas fa-search"></i>
          </button>
        </div>
      </div>
    </div>
  );
};
export default SearchBar;
