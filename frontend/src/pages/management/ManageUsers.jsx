import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import UserContainer from "../../components/ui/UserContainer";
import InnerContainer from "../../components/ui/InnerContainer";
import { useGetAllUsersQuery } from "../../redux/apis/userApi";
import Loader from "../../components/ui/Loader";
import ManageUserItem from "../../components/management-details/ManageUserItem";
import InputSelect from "../../components/ui/InputSelect";
import IconFilter from "../../components/ui/IconFilter";
import UserFilterModal from "../../components/management-details/UserFilterModal";
import Paginate from "../../components/ui/Paginate";
import Meta from "../../components/ui/Meta";
import { setAlert } from "../../redux/slices/userSlice";

export default function ManageUsers() {
  const [modal, setModal] = useState(false);
  const [sort, setSort] = useState("");
  const [filter, setFilter] = useState({ provider: "", role: "", active: "" });
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const { isLoading, data, error } = useGetAllUsersQuery(
    {
      sort,
      ...filter,
      page,
      limit: 8,
    },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (error) dispatch(setAlert({ type: "error", msg: error }));
  }, [error, dispatch]);

  const inputHandler = (e) => {
    setFilter((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  let content;
  if (isLoading) {
    content = <Loader />;
  } else if (data) {
    const allUsers = data.data.users;

    content = (
      <div>
        <div className="manage-top">
          <div className="manage-queries">
            <p>Total: {data.total}</p>
            <p>
              Page: {page} ({data.results} results)
            </p>
          </div>
          <div className="manage-queries">
            <IconFilter filter={filter} onClick={() => setModal(true)} />
            <InputSelect type="sort" onChange={(e) => setSort(e.target.value)}>
              <option value="">Newest</option>
              <option value="name">Name A to Z</option>
              <option value="-name">Name Z to A</option>
            </InputSelect>
          </div>
        </div>
        <div className="table-header users-table-grid">
          <p>Name</p>
          <p>Provider</p>
          <p>Role</p>
          <p>Status</p>
          <p>Actions</p>
        </div>
        <div className="line line-xs">&nbsp;</div>

        {allUsers.length > 0 ? (
          allUsers.map((el) => (
            <Fragment key={el._id}>
              <ManageUserItem user={el} />
              <div className="line line-xs">&nbsp;</div>
            </Fragment>
          ))
        ) : (
          <p style={{ fontSize: "1.6rem" }}>No results</p>
        )}
      </div>
    );
  }

  return (
    <UserContainer>
      <InnerContainer className="manage-view__inner-container">
        <Meta
          title="Manage users | Natours"
          description="Edit and delete users in Natours"
        />

        {modal && (
          <UserFilterModal
            inputHandler={inputHandler}
            onCancel={() => setModal(false)}
            filter={filter}
          />
        )}

        {content}

        {data && (
          <Paginate
            currentBtn={page}
            setCurrentBtn={setPage}
            pages={Math.ceil(data?.total / 8)}
            filter={filter}
            sort={sort}
          />
        )}
      </InnerContainer>
    </UserContainer>
  );
}
