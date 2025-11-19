import { useQuery } from 'react-query'
import Select, {components} from 'react-select'
import ProdsAPI from '../../api/prods.api'
import clsx from 'clsx';

const ServiceOptionColor = (props) => {
  const { data } = props;
  return (
    <components.Option {...props}>
      <span className={clsx(!data.IsRootPublic && "text-danger")}>
        {data.label}
      </span>
    </components.Option>
  );
};

function SelectService({ isMulti, value, loading, disabled, MemberID = '', StockID = '', ...props }) {
  const { data, isLoading } = useQuery({
    queryKey: ['ListStaffs', { MemberID, StockID }],
    queryFn: async () => {
      const { data } = await ProdsAPI.getRootServices({
        Key: '',
        StockID: StockID,
        MemberID: MemberID?.value || ''
      })
      return data?.lst?.map((x) => ({ ...x, label: x?.IsRootPublic ? x.Title : `${x.Title} (Ẩn)`, value: x.ID })) || []
    }
  })

  return (
    <>
      <Select
        components={{Option: ServiceOptionColor}}
        isMulti={isMulti}
        isLoading={loading || isLoading}
        isDisabled={disabled || isLoading}
        menuPosition='fixed'
        styles={{
          menuPortal: (base) => ({
            ...base,
            zIndex: 9999
          })
        }}
        menuPortalTarget={document.body}
        classNamePrefix='select'
        options={data || []}
        value={value}
        placeholder='Chọn dịch vụ'
        noOptionsMessage={() => 'Không có dịch vụ'}
        {...props}
      />
    </>
  )
}

export { SelectService }
