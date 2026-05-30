'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import AdminService, {
    AdminItem,
    AdminItemStatus,
    AdminReport,
    AdminReportFilter,
    AdminRoleFilter,
    AdminStats,
    AdminUser,
    AdminUserStatus,
} from '@/services/AdminService';
import UserService from '@/services/UserService';
import { REPORT_REASON_OPTIONS, ReportStatus } from '@/services/ReportService';
import { getValidAuthToken, removeAuthToken } from '@/Utils/authToken';

import {
    Actions,
    AdminBadge,
    EmptyState,
    ErrorMessage,
    FilterButton,
    Filters,
    Header,
    HeaderActions,
    ItemPreview,
    MetaGrid,
    Page,
    PageContainer,
    Pagination,
    PrimaryButton,
    ReportCard,
    ReportComment,
    ReportGrid,
    ReportHeader,
    ReportList,
    SecondaryButton,
    Select,
    StatusBadge,
    TextArea,
    TitleBlock,
    SearchInput,
    SearchRow,
    StatCard,
    StatsGrid,
    Tabs,
    TabButton,
} from './styled';

type TabId = 'overview' | 'reports' | 'items' | 'users';

const tabs: Array<{ id: TabId; label: string }> = [
    { id: 'overview', label: 'Огляд' },
    { id: 'reports', label: 'Скарги' },
    { id: 'items', label: 'Оголошення' },
    { id: 'users', label: 'Користувачі' },
];

const reportFilters: Array<{ value: AdminReportFilter; label: string }> = [
    { value: 'pending', label: 'Нові' },
    { value: 'reviewed', label: 'Переглянуті' },
    { value: 'resolved', label: 'Вирішені' },
    { value: 'dismissed', label: 'Відхилені' },
    { value: 'all', label: 'Усі' },
];

const reportStatusLabels: Record<ReportStatus, string> = {
    pending: 'Нова',
    reviewed: 'Переглянута',
    resolved: 'Вирішена',
    dismissed: 'Відхилена',
};

function getErrorMessage(error: any, fallback: string) {
    return error?.response?.data?.message || error?.message || fallback;
}

function getReasonLabel(reason: string) {
    return REPORT_REASON_OPTIONS.find((option) => option.value === reason)?.label || reason;
}

function getUserName(user?: AdminUser | string | null) {
    if (!user) return 'Користувач';
    if (typeof user === 'string') return user;

    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();

    return fullName || user.username || user.email || 'Користувач';
}

function getReportItem(report: AdminReport) {
    if (!report.item || typeof report.item === 'string') return null;

    return report.item;
}

function formatPrice(value?: number) {
    return new Intl.NumberFormat('uk-UA').format(Number(value || 0));
}

export default function AdminPage() {
    const router = useRouter();
    const token = useMemo(() => getValidAuthToken(), []);

    const [activeTab, setActiveTab] = useState<TabId>('overview');

    const [stats, setStats] = useState<AdminStats | null>(null);

    const [reports, setReports] = useState<AdminReport[]>([]);
    const [reportStatus, setReportStatus] = useState<AdminReportFilter>('pending');
    const [reportComments, setReportComments] = useState<Record<string, string>>({});
    const [reportsPage, setReportsPage] = useState(1);
    const [reportsTotalPages, setReportsTotalPages] = useState(1);

    const [items, setItems] = useState<AdminItem[]>([]);
    const [itemsSearch, setItemsSearch] = useState('');
    const [itemsStatus, setItemsStatus] = useState<AdminItemStatus>('active');
    const [itemsPage, setItemsPage] = useState(1);
    const [itemsTotalPages, setItemsTotalPages] = useState(1);

    const [users, setUsers] = useState<AdminUser[]>([]);
    const [usersSearch, setUsersSearch] = useState('');
    const [usersRole, setUsersRole] = useState<AdminRoleFilter>('all');
    const [usersStatus, setUsersStatus] = useState<AdminUserStatus>('all');
    const [usersPage, setUsersPage] = useState(1);
    const [usersTotalPages, setUsersTotalPages] = useState(1);

    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    async function ensureAdmin() {
        if (!token) {
            router.replace('/registration');
            return false;
        }

        try {
            const user = await UserService.me(token);

            if (!user.roles?.includes('ADMIN')) {
                router.replace('/home');
                return false;
            }

            return true;
        } catch {
            removeAuthToken();
            router.replace('/registration');
            return false;
        }
    }

    async function loadStats() {
        if (!token) return;

        const response = await AdminService.getStats(token);

        setStats(response);
    }

    async function loadReports(nextPage = reportsPage, nextStatus = reportStatus) {
        if (!token) return;

        const response = await AdminService.getReports(token, nextStatus, nextPage);

        setReports(response.reports || []);
        setReportsPage(response.page || nextPage);
        setReportsTotalPages(response.totalPages || 1);

        const nextComments: Record<string, string> = {};

        response.reports?.forEach((report) => {
            nextComments[report._id] = report.adminComment || '';
        });

        setReportComments(nextComments);
    }

    async function loadItems(nextPage = itemsPage) {
        if (!token) return;

        const response = await AdminService.getItems(token, {
            search: itemsSearch,
            status: itemsStatus,
            page: nextPage,
        });

        setItems(response.items || []);
        setItemsPage(response.page || nextPage);
        setItemsTotalPages(response.totalPages || 1);
    }

    async function loadUsers(nextPage = usersPage) {
        if (!token) return;

        const response = await AdminService.getUsers(token, {
            search: usersSearch,
            role: usersRole,
            status: usersStatus,
            page: nextPage,
        });

        setUsers(response.users || []);
        setUsersPage(response.page || nextPage);
        setUsersTotalPages(response.totalPages || 1);
    }

    useEffect(() => {
        async function init() {
            try {
                setIsLoading(true);

                const isAdmin = await ensureAdmin();

                if (!isAdmin) return;

                await Promise.all([loadStats(), loadReports(1, 'pending')]);
            } catch (e: any) {
                setError(getErrorMessage(e, 'Не вдалося завантажити адмін-панель'));
            } finally {
                setIsLoading(false);
            }
        }

        init();
    }, []);

    async function openTab(tab: TabId) {
        try {
            setActiveTab(tab);
            setError('');
            setMessage('');
            setIsLoading(true);

            if (tab === 'overview') await loadStats();
            if (tab === 'reports') await loadReports(1, reportStatus);
            if (tab === 'items') await loadItems(1);
            if (tab === 'users') await loadUsers(1);
        } catch (e: any) {
            setError(getErrorMessage(e, 'Не вдалося завантажити дані'));
        } finally {
            setIsLoading(false);
        }
    }

    async function updateReport(reportId: string, status: ReportStatus) {
        if (!token) return;

        try {
            setIsActionLoading(`${reportId}-${status}`);
            setError('');
            setMessage('');

            const updatedReport = await AdminService.updateReportStatus(
                token,
                reportId,
                status,
                reportComments[reportId] || '',
            );

            setReports((prev) =>
                prev.map((report) => (report._id === reportId ? updatedReport : report)),
            );

            setMessage('Статус скарги оновлено');
            await loadStats();
        } catch (e: any) {
            setError(getErrorMessage(e, 'Не вдалося оновити скаргу'));
        } finally {
            setIsActionLoading('');
        }
    }

    async function archiveItem(item: AdminItem) {
        if (!token) return;

        const confirmed = window.confirm(`Архівувати оголошення "${item.name}"?`);

        if (!confirmed) return;

        try {
            setIsActionLoading(`archive-${item._id}`);
            const updatedItem = await AdminService.archiveItem(token, item._id);

            setItems((prev) =>
                prev.map((currentItem) => (currentItem._id === item._id ? updatedItem : currentItem)),
            );

            setMessage('Оголошення перенесено в архів');
            await loadStats();
        } catch (e: any) {
            setError(getErrorMessage(e, 'Не вдалося архівувати оголошення'));
        } finally {
            setIsActionLoading('');
        }
    }

    async function restoreItem(item: AdminItem) {
        if (!token) return;

        try {
            setIsActionLoading(`restore-${item._id}`);
            const updatedItem = await AdminService.restoreItem(token, item._id);

            setItems((prev) =>
                prev.map((currentItem) => (currentItem._id === item._id ? updatedItem : currentItem)),
            );

            setMessage('Оголошення відновлено');
            await loadStats();
        } catch (e: any) {
            setError(getErrorMessage(e, 'Не вдалося відновити оголошення'));
        } finally {
            setIsActionLoading('');
        }
    }

    async function toggleAdminRole(user: AdminUser) {
        if (!token) return;

        const hasAdminRole = Boolean(user.roles?.includes('ADMIN'));
        const nextRoles = hasAdminRole ? ['USER'] : ['USER', 'ADMIN'];

        try {
            setIsActionLoading(`roles-${user._id}`);
            const updatedUser = await AdminService.updateUserRoles(token, user._id, nextRoles);

            setUsers((prev) =>
                prev.map((currentUser) => (currentUser._id === user._id ? updatedUser : currentUser)),
            );

            setMessage('Ролі користувача оновлено');
            await loadStats();
        } catch (e: any) {
            setError(getErrorMessage(e, 'Не вдалося оновити ролі'));
        } finally {
            setIsActionLoading('');
        }
    }

    async function toggleUserBlock(user: AdminUser) {
        if (!token) return;

        const nextBlocked = !user.isBlocked;
        const reason = nextBlocked
            ? window.prompt('Причина блокування') || ''
            : '';

        try {
            setIsActionLoading(`block-${user._id}`);
            const updatedUser = await AdminService.updateUserBlock(
                token,
                user._id,
                nextBlocked,
                reason,
            );

            setUsers((prev) =>
                prev.map((currentUser) => (currentUser._id === user._id ? updatedUser : currentUser)),
            );

            setMessage(nextBlocked ? 'Користувача заблоковано' : 'Користувача розблоковано');
            await loadStats();
        } catch (e: any) {
            setError(getErrorMessage(e, 'Не вдалося змінити статус користувача'));
        } finally {
            setIsActionLoading('');
        }
    }

    return (
        <Page>
            <PageContainer>
                <Header>
                    <TitleBlock>
                        <AdminBadge>Адміністрування</AdminBadge>
                        <h1>Панель керування</h1>
                        <p>Скарги, оголошення, користувачі та загальна статистика платформи.</p>
                    </TitleBlock>

                    <HeaderActions>
                        <SecondaryButton type="button" onClick={() => router.push('/home')}>
                            На головну
                        </SecondaryButton>
                    </HeaderActions>
                </Header>

                <Tabs>
                    {tabs.map((tab) => (
                        <TabButton
                            key={tab.id}
                            type="button"
                            $active={activeTab === tab.id}
                            onClick={() => openTab(tab.id)}
                        >
                            {tab.label}
                        </TabButton>
                    ))}
                </Tabs>

                {error && <ErrorMessage>{error}</ErrorMessage>}
                {message && <EmptyState $success>{message}</EmptyState>}

                {isLoading ? (
                    <EmptyState>Завантаження...</EmptyState>
                ) : (
                    <>
                        {activeTab === 'overview' && stats && (
                            <StatsGrid>
                                <StatCard>
                                    <span>Користувачі</span>
                                    <strong>{stats.users.total}</strong>
                                    <p>Адмінів: {stats.users.admins} · Заблоковано: {stats.users.blocked}</p>
                                </StatCard>

                                <StatCard>
                                    <span>Оголошення</span>
                                    <strong>{stats.items.total}</strong>
                                    <p>Активні: {stats.items.active} · Архів: {stats.items.archived}</p>
                                </StatCard>

                                <StatCard>
                                    <span>Скарги</span>
                                    <strong>{stats.reports.total}</strong>
                                    <p>Нові: {stats.reports.byStatus.pending || 0}</p>
                                </StatCard>

                                <StatCard>
                                    <span>Модерація</span>
                                    <strong>{stats.reports.byStatus.resolved || 0}</strong>
                                    <p>Вирішених скарг</p>
                                </StatCard>
                            </StatsGrid>
                        )}

                        {activeTab === 'reports' && (
                            <>
                                <Filters>
                                    {reportFilters.map((filter) => (
                                        <FilterButton
                                            key={filter.value}
                                            type="button"
                                            $active={reportStatus === filter.value}
                                            onClick={async () => {
                                                setReportStatus(filter.value);
                                                await loadReports(1, filter.value);
                                            }}
                                        >
                                            {filter.label}
                                        </FilterButton>
                                    ))}
                                </Filters>

                                <ReportList>
                                    {reports.map((report) => {
                                        const item = getReportItem(report);

                                        return (
                                            <ReportCard key={report._id}>
                                                <ReportHeader>
                                                    <div>
                                                        <StatusBadge $status={report.status}>
                                                            {reportStatusLabels[report.status]}
                                                        </StatusBadge>
                                                        <h2>{getReasonLabel(report.reason)}</h2>
                                                    </div>
                                                </ReportHeader>

                                                <ReportGrid>
                                                    <ItemPreview>
                                                        {item?.img?.[0] && (
                                                            <img
                                                                src={`http://localhost:3005/img/${item.img[0]}`}
                                                                alt={item.name}
                                                            />
                                                        )}

                                                        <div>
                                                            <strong>{item?.name || 'Оголошення недоступне'}</strong>
                                                            {item && (
                                                                <span>
                                                                    {formatPrice(item.price)} грн · {item.location}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </ItemPreview>

                                                    <MetaGrid>
                                                        <p>
                                                            <span>Скаржник</span>
                                                            <strong>{getUserName(report.reporter)}</strong>
                                                        </p>

                                                        <p>
                                                            <span>Продавець</span>
                                                            <strong>{getUserName(item?.owner)}</strong>
                                                        </p>
                                                    </MetaGrid>
                                                </ReportGrid>

                                                {report.comment && (
                                                    <ReportComment>
                                                        <span>Коментар користувача</span>
                                                        <p>{report.comment}</p>
                                                    </ReportComment>
                                                )}

                                                <TextArea
                                                    value={reportComments[report._id] || ''}
                                                    placeholder="Коментар адміністратора"
                                                    onChange={(event) =>
                                                        setReportComments((prev) => ({
                                                            ...prev,
                                                            [report._id]: event.target.value,
                                                        }))
                                                    }
                                                />

                                                <Actions>
                                                    {item?._id && (
                                                        <SecondaryButton
                                                            type="button"
                                                            onClick={() => router.push(`/obyava/${item._id}`)}
                                                        >
                                                            Переглянути
                                                        </SecondaryButton>
                                                    )}

                                                    <PrimaryButton
                                                        type="button"
                                                        disabled={Boolean(isActionLoading)}
                                                        onClick={() => updateReport(report._id, 'reviewed')}
                                                    >
                                                        Переглянуто
                                                    </PrimaryButton>

                                                    <PrimaryButton
                                                        type="button"
                                                        disabled={Boolean(isActionLoading)}
                                                        onClick={() => updateReport(report._id, 'resolved')}
                                                    >
                                                        Вирішено
                                                    </PrimaryButton>

                                                    <SecondaryButton
                                                        type="button"
                                                        disabled={Boolean(isActionLoading)}
                                                        onClick={() => updateReport(report._id, 'dismissed')}
                                                    >
                                                        Відхилити
                                                    </SecondaryButton>
                                                </Actions>
                                            </ReportCard>
                                        );
                                    })}
                                </ReportList>

                                <Pagination>
                                    <span>Сторінка {reportsPage} / {reportsTotalPages}</span>
                                    <div>
                                        <SecondaryButton disabled={reportsPage <= 1} onClick={() => loadReports(reportsPage - 1)}>
                                            Назад
                                        </SecondaryButton>
                                        <SecondaryButton disabled={reportsPage >= reportsTotalPages} onClick={() => loadReports(reportsPage + 1)}>
                                            Далі
                                        </SecondaryButton>
                                    </div>
                                </Pagination>
                            </>
                        )}

                        {activeTab === 'items' && (
                            <>
                                <SearchRow>
                                    <SearchInput
                                        value={itemsSearch}
                                        placeholder="Пошук оголошень"
                                        onChange={(event) => setItemsSearch(event.target.value)}
                                    />

                                    <Select value={itemsStatus} onChange={(event) => setItemsStatus(event.target.value as AdminItemStatus)}>
                                        <option value="active">Активні</option>
                                        <option value="archived">Архів</option>
                                        <option value="all">Усі</option>
                                    </Select>

                                    <PrimaryButton type="button" onClick={() => loadItems(1)}>
                                        Знайти
                                    </PrimaryButton>
                                </SearchRow>

                                <ReportList>
                                    {items.map((item) => (
                                        <ReportCard key={item._id}>
                                            <ReportGrid>
                                                <ItemPreview>
                                                    {item.img?.[0] && (
                                                        <img
                                                            src={`http://localhost:3005/img/${item.img[0]}`}
                                                            alt={item.name}
                                                        />
                                                    )}

                                                    <div>
                                                        <strong>{item.name}</strong>
                                                        <span>
                                                            {formatPrice(item.price)} грн · {item.location}
                                                        </span>
                                                        {item.isArchived && <AdminBadge>В архіві</AdminBadge>}
                                                    </div>
                                                </ItemPreview>

                                                <MetaGrid>
                                                    <p>
                                                        <span>Власник</span>
                                                        <strong>{getUserName(item.owner)}</strong>
                                                    </p>

                                                    <p>
                                                        <span>Категорія</span>
                                                        <strong>
                                                            {item.categoryData?.subcategory || item.categoryData?.category || 'Не вказано'}
                                                        </strong>
                                                    </p>
                                                </MetaGrid>
                                            </ReportGrid>

                                            <Actions>
                                                <SecondaryButton type="button" onClick={() => router.push(`/obyava/${item._id}`)}>
                                                    Переглянути
                                                </SecondaryButton>

                                                {item.isArchived ? (
                                                    <PrimaryButton disabled={Boolean(isActionLoading)} onClick={() => restoreItem(item)}>
                                                        Відновити
                                                    </PrimaryButton>
                                                ) : (
                                                    <SecondaryButton $danger disabled={Boolean(isActionLoading)} onClick={() => archiveItem(item)}>
                                                        Архівувати
                                                    </SecondaryButton>
                                                )}
                                            </Actions>
                                        </ReportCard>
                                    ))}
                                </ReportList>

                                <Pagination>
                                    <span>Сторінка {itemsPage} / {itemsTotalPages}</span>
                                    <div>
                                        <SecondaryButton disabled={itemsPage <= 1} onClick={() => loadItems(itemsPage - 1)}>
                                            Назад
                                        </SecondaryButton>
                                        <SecondaryButton disabled={itemsPage >= itemsTotalPages} onClick={() => loadItems(itemsPage + 1)}>
                                            Далі
                                        </SecondaryButton>
                                    </div>
                                </Pagination>
                            </>
                        )}

                        {activeTab === 'users' && (
                            <>
                                <SearchRow>
                                    <SearchInput
                                        value={usersSearch}
                                        placeholder="Пошук користувачів"
                                        onChange={(event) => setUsersSearch(event.target.value)}
                                    />

                                    <Select value={usersRole} onChange={(event) => setUsersRole(event.target.value as AdminRoleFilter)}>
                                        <option value="all">Усі ролі</option>
                                        <option value="USER">USER</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </Select>

                                    <Select value={usersStatus} onChange={(event) => setUsersStatus(event.target.value as AdminUserStatus)}>
                                        <option value="all">Усі</option>
                                        <option value="active">Активні</option>
                                        <option value="blocked">Заблоковані</option>
                                    </Select>

                                    <PrimaryButton type="button" onClick={() => loadUsers(1)}>
                                        Знайти
                                    </PrimaryButton>
                                </SearchRow>

                                <ReportList>
                                    {users.map((user) => (
                                        <ReportCard key={user._id}>
                                            <ReportHeader>
                                                <div>
                                                    <AdminBadge>{user.roles?.join(', ') || 'USER'}</AdminBadge>
                                                    <h2>{getUserName(user)}</h2>
                                                </div>

                                                {user.isBlocked && <StatusBadge $status="dismissed">Заблокований</StatusBadge>}
                                            </ReportHeader>

                                            <MetaGrid>
                                                <p>
                                                    <span>Email</span>
                                                    <strong>{user.email || 'Не вказано'}</strong>
                                                </p>

                                                <p>
                                                    <span>Місто</span>
                                                    <strong>{user.city || 'Не вказано'}</strong>
                                                </p>

                                                <p>
                                                    <span>Причина блокування</span>
                                                    <strong>{user.blockedReason || 'Немає'}</strong>
                                                </p>
                                            </MetaGrid>

                                            <Actions>
                                                <PrimaryButton disabled={Boolean(isActionLoading)} onClick={() => toggleAdminRole(user)}>
                                                    {user.roles?.includes('ADMIN') ? 'Забрати ADMIN' : 'Зробити ADMIN'}
                                                </PrimaryButton>

                                                <SecondaryButton
                                                    $danger={!user.isBlocked}
                                                    disabled={Boolean(isActionLoading)}
                                                    onClick={() => toggleUserBlock(user)}
                                                >
                                                    {user.isBlocked ? 'Розблокувати' : 'Заблокувати'}
                                                </SecondaryButton>
                                            </Actions>
                                        </ReportCard>
                                    ))}
                                </ReportList>

                                <Pagination>
                                    <span>Сторінка {usersPage} / {usersTotalPages}</span>
                                    <div>
                                        <SecondaryButton disabled={usersPage <= 1} onClick={() => loadUsers(usersPage - 1)}>
                                            Назад
                                        </SecondaryButton>
                                        <SecondaryButton disabled={usersPage >= usersTotalPages} onClick={() => loadUsers(usersPage + 1)}>
                                            Далі
                                        </SecondaryButton>
                                    </div>
                                </Pagination>
                            </>
                        )}
                    </>
                )}
            </PageContainer>
        </Page>
    );
}