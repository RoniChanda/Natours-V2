import InputSelect from "../ui/InputSelect";
import FilterModal from "../ui/FilterModal";

export default function UserFilterModal({ onCancel, inputHandler, filter }) {
  return (
    <FilterModal onCancel={onCancel}>
      <InputSelect
        type="provider"
        onChange={inputHandler}
        value={filter.provider}
      >
        <option value="">All</option>
        <option value="local">Local</option>
        <option value="Google">Google</option>
      </InputSelect>
      <InputSelect type="role" onChange={inputHandler} value={filter.role}>
        <option value="">All</option>
        <option value="user">User</option>
        <option value="admin">Admin</option>
        <option value="lead-guide">Lead-Guide</option>
        <option value="guide">Tour-Guide</option>
      </InputSelect>
      <InputSelect type="active" onChange={inputHandler} value={filter.active}>
        <option value="">All</option>
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </InputSelect>
    </FilterModal>
  );
}
