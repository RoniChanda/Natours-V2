import InputSelect from "../ui/InputSelect";
import FilterModal from "../ui/FilterModal";
import { useFetchAllToursQuery } from "../../redux/apis/tourApi";
import Alert from "../ui/Alert";

export default function BookingFilterModal({ onCancel, inputHandler, filter }) {
  const { data, error } = useFetchAllToursQuery({ limit: "_id,name" });

  return (
    <FilterModal onCancel={onCancel}>
      {error && <Alert type="error" msg={error.data?.message || error.error} />}

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
