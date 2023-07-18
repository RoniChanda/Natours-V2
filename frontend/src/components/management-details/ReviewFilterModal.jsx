import InputSelect from "../ui/InputSelect";
import FilterModal from "../ui/FilterModal";
import { useFetchAllToursQuery } from "../../redux/apis/tourApi";
import Alert from "../ui/Alert";

export default function ReviewFilterModal({ onCancel, inputHandler, filter }) {
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
