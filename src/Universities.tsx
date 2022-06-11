import { Avatar, Divider, ListItem, ListItemAvatar, ListItemText, Paper } from "@mui/material"
import { useNavigate } from "react-router-dom";
import { Virtuoso } from "react-virtuoso"
import { UniversitiesQuery, useUniversitiesQuery } from "./generated/graphql"

export default () => {
    const navigate = useNavigate();
    const { loading, error, data, fetchMore } = useUniversitiesQuery({
        variables: {
            first: 20,
        }
    })

    if (loading) return <div> Loading... </div>

    const pageInfo = data?.universities.pageInfo

    const itemContent = (index: number, universitiesQuery: UniversitiesQuery | undefined) => {
        const university = universitiesQuery?.universities.edges[index].node
        const subcampusesCount = university?.subcampuses.totalCount ?? 0
        const institutesCount = university?.institutes.totalCount ?? 0

        return (
            <>
                <ListItem button onClick={() => {
                    navigate(`/university/${university?.id}`)
                }}>
                    <ListItemAvatar>
                        <Avatar alt='avatar' src={university?.logoUrl ?? ''} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={university?.name} 
                        secondary={`${institutesCount}个学院,${subcampusesCount}个校区`}/>
                </ListItem>
                <Divider variant="inset" />
            </>
        )
    }

    return (
        <Paper sx={{ flexGrow: 1, height: '100%' }}>
            <Virtuoso
                style={{ height: 'calc(100vh - 56px)', flexGrow: 1 }}
                totalCount={data?.universities.edges.length ?? 0}
                itemContent={(index) => itemContent(index, data)}
                endReached={() => {
                    fetchMore({
                        variables: {
                            after: pageInfo?.endCursor,
                            first: 20
                        }
                    })
                }} />
        </Paper>
    )
}