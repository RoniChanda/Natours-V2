import { useEffect } from "react";
import { useDispatch } from "react-redux";

import InputSelect from "../ui/InputSelect";
import FilterModal from "../ui/FilterModal";
import { useFetchAllToursQuery } from "../../redux/apis/tourApi";
import { setAlert } from "../../redux/slices/userSlice";

export default function ReviewFilterModal({ onCancel, inputHandler, filter }) {
  const dispatch = useDispatch();
  const { data, error } = useFetchAllToursQuery({ limit: "_id,name" });

  useEffect(() => {
    if (error) dispatch(setAlert({ type: "error", msg: error }));
  }, [error, dispatch]);

  return (
    <FilterModal onCancel={onCancel}>
      <div className="filter-modal-inner">
        <InputSelect type="tour" onChange={inputHandler} value={filter.tour}>
          <option value="">All</option>
          {data?.data?.tours?.map((el) => (
            <option key={el._id} value={el._id}>
              {el.name}
            </option>
          ))}
        </InputSelect>
        <InputSelect
          type="rating"
          onChange={inputHandler}
          value={filter.rating}
        >
          <option value="">All</option>
          <option value="5">5</option>
          <option value="4">4</option>
          <option value="3">3</option>
          <option value="2">2</option>
          <option value="1">1</option>
        </InputSelect>
      </div>
    </FilterModal>
  );
}
