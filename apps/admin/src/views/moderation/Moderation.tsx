import { useCallback, useEffect, useState } from 'react'
import AxiosBase from '@/services/axios/AxiosBase'

type Tab = 'users' | 'posts' | 'reels' | 'stories' | 'reports'
type UserRow = {
    _id: string
    username: string
    fullname: string
    email: string
    role?: string
}
type MediaRow = {
    _id: string
    caption?: string
    media?: { url: string }[]
    mediaUrls?: string[]
    mediaUrl?: string
    user?: { username?: string }
}
type ReportRow = {
    _id: string
    targetType: string
    targetId: string
    reason: string
    status: 'pending' | 'reviewed' | 'dismissed'
    reportedBy?: { username?: string }
    adminNote?: string
}

const tabs: { value: Tab; label: string }[] = [
    { value: 'users', label: 'Người dùng' },
    { value: 'posts', label: 'Bài viết' },
    { value: 'reels', label: 'Reels' },
    { value: 'stories', label: 'Stories' },
    { value: 'reports', label: 'Báo cáo' },
]

function extractRows<T>(payload: unknown): T[] {
    if (Array.isArray(payload)) return payload as T[]
    if (!payload || typeof payload !== 'object') return []
    const root = payload as Record<string, unknown>
    const data = root.data
    if (Array.isArray(data)) return data as T[]
    if (data && typeof data === 'object') {
        const docs = (data as Record<string, unknown>).docs
        if (Array.isArray(docs)) return docs as T[]
    }
    const docs = root.docs
    return Array.isArray(docs) ? docs as T[] : []
}

const Moderation = () => {
    const [tab, setTab] = useState<Tab>('reports')
    const [users, setUsers] = useState<UserRow[]>([])
    const [posts, setPosts] = useState<MediaRow[]>([])
    const [reels, setReels] = useState<MediaRow[]>([])
    const [stories, setStories] = useState<MediaRow[]>([])
    const [reports, setReports] = useState<ReportRow[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const loadTab = useCallback(async () => {
        setLoading(true)
        setError('')
        try {
            if (tab === 'users') {
                const response = await AxiosBase.get<unknown>('/user')
                setUsers(extractRows<UserRow>(response.data))
            } else if (tab === 'posts') {
                const response = await AxiosBase.get<unknown>('/posts')
                setPosts(extractRows<MediaRow>(response.data))
            } else if (tab === 'reels') {
                const response = await AxiosBase.get<unknown>('/reel')
                setReels(extractRows<MediaRow>(response.data))
            } else if (tab === 'stories') {
                const response = await AxiosBase.get<unknown>('/story')
                setStories(extractRows<MediaRow>(response.data))
            } else {
                const response = await AxiosBase.get<unknown>('/reports')
                setReports(extractRows<ReportRow>(response.data))
            }
        } catch {
            setError('Không thể tải dữ liệu kiểm duyệt. Hãy kiểm tra quyền admin và kết nối API.')
        } finally {
            setLoading(false)
        }
    }, [tab])

    useEffect(() => {
        void loadTab()
    }, [loadTab])

    const deleteItem = async (endpoint: string, id: string) => {
        if (!window.confirm('Bạn có chắc muốn xóa nội dung này?')) return
        setError('')
        try {
            await AxiosBase.delete(`/${endpoint}/${id}`)
            await loadTab()
        } catch {
            setError('Không thể xóa mục đã chọn.')
        }
    }

    const updateReport = async (reportId: string, status: 'reviewed' | 'dismissed') => {
        setError('')
        try {
            await AxiosBase.patch(`/reports/${reportId}`, { status })
            await loadTab()
        } catch {
            setError('Không thể cập nhật báo cáo.')
        }
    }

    const contentRows =
        tab === 'posts' ? posts : tab === 'reels' ? reels : stories
    const contentEndpoint = tab === 'posts' ? 'posts' : tab === 'reels' ? 'reel' : 'story'

    return (
        <div className="p-4 md:p-8">
            <div className="mb-6">
                <h3 className="mb-1">Kiểm duyệt</h3>
                <p>Quản lý tài khoản, nội dung và báo cáo người dùng.</p>
            </div>
            <div className="mb-6 flex flex-wrap gap-2">
                {tabs.map((item) => (
                    <button
                        key={item.value}
                        type="button"
                        onClick={() => setTab(item.value)}
                        className={`rounded px-4 py-2 ${tab === item.value ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                    >
                        {item.label}
                    </button>
                ))}
                <button type="button" onClick={() => void loadTab()} className="ml-auto rounded border px-4 py-2">
                    Tải lại
                </button>
            </div>

            {error && <p role="alert" className="mb-4 text-red-600">{error}</p>}
            {loading ? (
                <p>Đang tải...</p>
            ) : tab === 'users' ? (
                <div className="overflow-x-auto rounded border">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50"><tr><th className="p-3">Tài khoản</th><th className="p-3">Email</th><th className="p-3">Vai trò</th><th className="p-3">Thao tác</th></tr></thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="border-t">
                                    <td className="p-3">{user.fullname} <span className="text-gray-500">@{user.username}</span></td>
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3">{user.role ?? 'user'}</td>
                                    <td className="p-3">
                                        <button type="button" onClick={() => void deleteItem('user', user._id)} className="text-red-600">
                                            Xóa tài khoản
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!users.length && <p className="p-4 text-sm text-gray-500">Không có người dùng.</p>}
                </div>
            ) : tab === 'reports' ? (
                <div className="grid gap-3">
                    {reports.map((report) => (
                        <article key={report._id} className="rounded border p-4">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <p className="font-semibold">{report.targetType} · {report.status}</p>
                                    <p className="text-sm">{report.reason}</p>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Báo cáo bởi @{report.reportedBy?.username ?? 'người dùng'} · ID: {report.targetId}
                                    </p>
                                </div>
                                {report.status === 'pending' && (
                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => void updateReport(report._id, 'reviewed')} className="rounded bg-blue-600 px-3 py-1 text-white">
                                            Đã xử lý
                                        </button>
                                        <button type="button" onClick={() => void updateReport(report._id, 'dismissed')} className="rounded border px-3 py-1">
                                            Bỏ qua
                                        </button>
                                    </div>
                                )}
                            </div>
                        </article>
                    ))}
                    {!reports.length && <p className="text-sm text-gray-500">Không có báo cáo.</p>}
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {contentRows.map((item) => {
                        const thumbnail = item.media?.[0]?.url ?? item.mediaUrls?.[0] ?? item.mediaUrl
                        return (
                            <article key={item._id} className="overflow-hidden rounded border">
                                {thumbnail && <img src={thumbnail} alt="" className="h-48 w-full object-cover" />}
                                <div className="p-3">
                                    <p className="line-clamp-2 text-sm">{item.caption || 'Không có chú thích'}</p>
                                    <p className="mt-1 text-xs text-gray-500">@{item.user?.username ?? 'tài khoản'} · {item._id}</p>
                                    <button type="button" onClick={() => void deleteItem(contentEndpoint, item._id)} className="mt-3 text-sm text-red-600">
                                        Gỡ nội dung
                                    </button>
                                </div>
                            </article>
                        )
                    })}
                    {!contentRows.length && <p className="text-sm text-gray-500">Không có nội dung.</p>}
                </div>
            )}
        </div>
    )
}

export default Moderation
