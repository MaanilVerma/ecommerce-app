import React from "react";
import ReactPaginate from "react-paginate";
import { Pagination } from "~/libs/models/categories.model";

const Pagination: React.FC<Pagination> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  return (
    <>
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center space-x-4">
          <button
            className="font-semibold"
            onClick={() => {
              onPageChange(0);
            }}
          >
            {"<<"}
          </button>
          <ReactPaginate
            breakLabel="..."
            nextLabel=" >"
            onPageChange={({ selected }: { selected: number }) =>
              onPageChange(selected)
            }
            pageRangeDisplayed={7}
            pageCount={totalPages}
            previousLabel="< "
            forcePage={currentPage}
            marginPagesDisplayed={0}
            activeClassName="!text-black"
            pageClassName="text-gray-500"
            className="flex space-x-4 font-semibold"
          />
          <button
            className="font-semibold"
            onClick={() => {
              onPageChange(totalPages - 1);
            }}
          >
            {">>"}
          </button>
        </div>
      )}
    </>
  );
};

export default Pagination;
