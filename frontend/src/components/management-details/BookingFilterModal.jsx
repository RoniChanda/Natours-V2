import { useEffect } from "react";
import { useDispatch } from "react-redux";

import InputSelect from "../ui/InputSelect";
import FilterModal from "../ui/FilterModal";
import { useFetchAllToursQuery } from "../../redux/apis/tourApi";
import { setAlert } from "../../redux/slices/userSlice";

export default function BookingFilterModal({ onCancel, inputHandler, filter }) {
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
          type="status"
          onChange={inputHandler}
          value={filter.status}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="canceled">Canceled</option>
          <option value="refunded">Refunded</option>
        </InputSelect>
      </div>
    </FilterModal>
  );
}
