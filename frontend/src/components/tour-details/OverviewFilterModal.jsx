import InputSelect from "../ui/InputSelect";
import FilterModal from "../ui/FilterModal";

export default function OverviewFilterModal({
  onCancel,
  inputHandler,
  filter,
}) {
  return (
    <FilterModal onCancel={onCancel}>
      <div className="filter-modal-inner">
        <InputSelect
          type="difficulty"
          onChange={inputHandler}
          value={filter.difficulty}
        >
          <option value="">All</option>
          <option value="difficult">Difficult</option>
          <option value="medium">Medium</option>
          <option value="easy">Easy</option>
        </InputSelect>
        <InputSelect
          type="rating"
          onChange={inputHandler}
          value={filter.rating}
        >
          <option value="0">All</option>
          <option value="4">{`>= 4.0`}</option>
          <option value="3">{`>= 3.0`}</option>
          <option value="2">{`>= 2.0`}</option>
          <option value="1">{`>= 1.0`}</option>
        </InputSelect>
      </div>
    </FilterModal>
  );
}
