import { ButtonGroup, IconButton, Pagination } from "@chakra-ui/react"
import { LuChevronLeft, LuChevronRight } from "react-icons/lu"

type PaginationComponentProps = {count: number,pageSize:number,defaultPage: number, onPageChange:(d: {page:number, pageSize:number})=>void}

export const PaginationComponent = ({count, pageSize, defaultPage, onPageChange, ...otherProps}: PaginationComponentProps) => {
  return (
    <Pagination.Root count={count} pageSize={pageSize} defaultPage={defaultPage} onPageChange={onPageChange} role="navigation" aria-label="pagination" {...otherProps}>
      <ButtonGroup variant="ghost" size="sm">
        <Pagination.PrevTrigger asChild>
          <IconButton>
            <LuChevronLeft />
          </IconButton>
        </Pagination.PrevTrigger>

        <Pagination.Items
          render={(page) => (
            <IconButton variant={{ base: "ghost", _selected: "outline" }}>
              {page.value}
            </IconButton>
          )}
        />

        <Pagination.NextTrigger asChild>
          <IconButton>
            <LuChevronRight />
          </IconButton>
        </Pagination.NextTrigger>
      </ButtonGroup>
    </Pagination.Root>
  )
}
export default PaginationComponent