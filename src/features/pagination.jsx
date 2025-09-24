import React from "react";
import { Link } from "react-router-dom";
import getUniqueId from "../utils/getUniqueId";

const Pagination = ({
  currentPage=1,
  selectPageHandler = ()=>{},
  totalItems = 0,
  showRows = 10,
}) => {
  return (
    <ul
      className="pagination"
      // style={{ display: "flex", gap: 4, justifyContent: "center" }}
    >
      {/* Arrow Button for Previous Page*/}
      {Math.ceil(totalItems / showRows) >= 5 && (
        <li
          className={currentPage > 1 ? "waves-effect" : "pagination_disabled"}
          onClick={() => selectPageHandler(currentPage - 1)}
        >
          <a href="#!">
            <i className="material-icons">chevron_left</i>
          </a>
        </li>
      )}

      {/*Ellipses before currentPage numbers*/}
      <li
        id={
          currentPage > 1 && Math.ceil(totalItems / showRows) > 5
            ? ""
            : "ellipsesBefore_disabled"
        }
        className="waves-effect"
      >
        <a href="#!">...</a>
      </li>

      {/* Displaying currentPage Numbers */}
      {[...Array(Math.ceil(totalItems / showRows))].map((_, index) => (
        <React.Fragment key={getUniqueId()}>
          {(index >= currentPage - 1 && index < currentPage + 4) ||
          (index < currentPage + 4 &&
            index > Math.ceil(totalItems / showRows) - 6) ? (
            <li
              className={currentPage === index + 1 ? "active" : "waves-effect"}
              onClick={() => {
                selectPageHandler(index + 1);
              }}
            >
              <Link to="#!">{index + 1}</Link>
            </li>
          ) : (
            <></>
          )}
        </React.Fragment>
      ))}

      {/* Ellipsis after currentPage numbers */}
      {currentPage <= Math.ceil(totalItems / showRows) - 5 && (
        <li
          className={
            currentPage < Math.ceil(totalItems / showRows)
              ? "waves-effect"
              : "pagination_disabled waves-effect "
          }
        >
          <a href="#!">...</a>
        </li>
      )}

      {/* Arrow Button for Next Page */}
      {Math.ceil(totalItems / showRows) >= 5 && (
        <li
          className={
            currentPage < Math.ceil(totalItems / showRows)
              ? "waves-effect"
              : "pagination_disabled"
          }
          onClick={() => selectPageHandler(currentPage + 1)}
        >
          <a href="#!">
            <i className="material-icons">chevron_right</i>
          </a>
        </li>
      )}
    </ul>
  );
};

export default Pagination;
