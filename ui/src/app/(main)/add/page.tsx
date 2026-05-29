'use client';

import {
    ChangeEvent,
    FormEvent,
    useEffect,
    useMemo,
    useState,
} from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

import { Category, CategoryService, Subcategory } from '@/services/CategoryService';
import ItemService from '@/services/ItemService';

import {
    Actions,
    BackButton,
    ErrorMessage,
    Field,
    FileCard,
    FileGrid,
    Form,
    FormCard,
    FormGrid,
    HelpText,
    ImagePreview,
    Page,
    PageContainer,
    PageDescription,
    PageHeader,
    PageTitle,
    PrimaryButton,
    RadioCard,
    RadioGrid,
    Select,
    SubmitMessage,
    TextArea,
    TextInput,
    UploadBox,
} from './styled';
import {getAuthToken} from "@/Utils/authToken";

type FormState = {
    name: string;
    description: string;
    price: string;
    location: string;
    category: string;
    subcategory: string;
    isNewState: boolean;
};

const initialForm: FormState = {
    name: '',
    description: '',
    price: '',
    location: '',
    category: '',
    subcategory: '',
    isNewState: false,
};

function getToken() {
    return getAuthToken() || '';
}

function getErrorMessage(error: any, fallback: string) {
    return error?.response?.data?.message || error?.message || fallback;
}

function getSubcategoryName(subcategory: Subcategory | string) {
    if (typeof subcategory === 'string') return subcategory;

    return subcategory.name;
}

export default function AddPage() {
    const router = useRouter();

    const [form, setForm] = useState<FormState>(initialForm);
    const [categories, setCategories] = useState<Category[]>([]);
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const selectedCategory = useMemo(
        () => categories.find((category) => category.name === form.category),
        [categories, form.category],
    );

    const subcategories = useMemo(() => {
        if (!selectedCategory?.subcategories) return [];

        return selectedCategory.subcategories;
    }, [selectedCategory]);

    useEffect(() => {
        async function loadCategories() {
            try {
                setIsLoadingCategories(true);

                const data = await CategoryService.getCategories();

                setCategories(data || []);
            } catch (e: any) {
                setError(getErrorMessage(e, 'Не вдалося завантажити категорії'));
            } finally {
                setIsLoadingCategories(false);
            }
        }

        loadCategories();
    }, []);

    useEffect(() => {
        const urls = images.map((image) => URL.createObjectURL(image));

        setPreviews(urls);

        return () => {
            urls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [images]);

    function handleChange(
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) {
        const { name, value } = event.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
            ...(name === 'category' ? { subcategory: '' } : {}),
        }));
    }

    function handleStateChange(value: boolean) {
        setForm((prev) => ({
            ...prev,
            isNewState: value,
        }));
    }

    function handleImagesChange(event: ChangeEvent<HTMLInputElement>) {
        const selectedFiles = Array.from(event.target.files || []);

        if (selectedFiles.length > 5) {
            setError('Можна завантажити максимум 5 фото');
            event.target.value = '';
            return;
        }

        const validFiles = selectedFiles.filter((file) =>
            ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type),
        );

        if (validFiles.length !== selectedFiles.length) {
            setError('Можна завантажувати тільки JPG або PNG зображення');
            event.target.value = '';
            return;
        }

        setError('');
        setImages(validFiles);
    }

    function removeImage(index: number) {
        setImages((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
    }

    function validateForm() {
        if (!form.name.trim()) return 'Вкажіть назву оголошення';
        if (!form.description.trim()) return 'Додайте опис товару';
        if (!form.price.trim()) return 'Вкажіть ціну';
        if (Number(form.price) <= 0) return 'Ціна має бути більшою за 0';
        if (!form.location.trim()) return 'Вкажіть місто або локацію';
        if (!form.category) return 'Оберіть категорію';
        if (images.length === 0) return 'Додайте хоча б одне фото товару';

        return '';
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            setError('');
            setSuccess('');

            const validationError = validateForm();

            if (validationError) {
                setError(validationError);
                return;
            }

            const token = getToken();

            if (!token) {
                setError('Щоб створити оголошення, потрібно увійти в акаунт');
                router.push('/registration');
                return;
            }

            setIsSubmitting(true);

            const formData = new FormData();

            formData.append('name', form.name.trim());
            formData.append('description', form.description.trim());
            formData.append('price', form.price.trim());
            formData.append('location', form.location.trim());
            formData.append('isNewState', String(form.isNewState));

            formData.append('categoryData[category]', form.category);
            formData.append('categoryData[subcategory]', form.subcategory);

            images.forEach((image) => {
                formData.append('img', image);
            });
            console.log(formData);
            const createdItem = await ItemService.createItem(token, formData);

            setSuccess('Оголошення успішно створено');

            if (createdItem?._id) {
                router.push(`/obyava/${createdItem._id}`);
            } else {
                router.push('/home');
            }
        } catch (e: any) {
            setError(getErrorMessage(e, 'Не вдалося створити оголошення'));
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Page>
            <PageContainer>
                <PageHeader>
                    <div>
                        <PageTitle>Створити оголошення</PageTitle>
                        <PageDescription>
                            Додайте фото, опис, категорію та контактну локацію, щоб покупці могли
                            швидко знайти ваш товар.
                        </PageDescription>
                    </div>

                    <BackButton type="button" onClick={() => router.back()}>
                        Назад
                    </BackButton>
                </PageHeader>

                <FormCard>
                    <Form onSubmit={handleSubmit}>
                        <FormGrid>
                            <Field>
                                <label htmlFor="name">Назва товару</label>
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Наприклад: iPhone 13 Pro 128GB"
                                />
                            </Field>

                            <Field>
                                <label htmlFor="price">Ціна, грн</label>
                                <TextInput
                                    id="price"
                                    name="price"
                                    type="number"
                                    min="1"
                                    value={form.price}
                                    onChange={handleChange}
                                    placeholder="12000"
                                />
                            </Field>

                            <Field>
                                <label htmlFor="location">Місто</label>
                                <TextInput
                                    id="location"
                                    name="location"
                                    value={form.location}
                                    onChange={handleChange}
                                    placeholder="Чернівці"
                                />
                            </Field>

                            <Field>
                                <label htmlFor="category">Категорія</label>
                                <Select
                                    id="category"
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    disabled={isLoadingCategories}
                                >
                                    <option value="">
                                        {isLoadingCategories ? 'Завантаження...' : 'Оберіть категорію'}
                                    </option>

                                    {categories.map((category) => (
                                        <option key={category.name} value={category.name}>
                                            {category.name}
                                        </option>
                                    ))}
                                </Select>
                            </Field>

                            <Field>
                                <label htmlFor="subcategory">Підкатегорія</label>
                                <Select
                                    id="subcategory"
                                    name="subcategory"
                                    value={form.subcategory}
                                    onChange={handleChange}
                                    disabled={!subcategories.length}
                                >
                                    <option value="">
                                        {subcategories.length
                                            ? 'Оберіть підкатегорію'
                                            : 'Підкатегорій немає'}
                                    </option>

                                    {subcategories.map((subcategory) => {
                                        const name = getSubcategoryName(subcategory);

                                        return (
                                            <option key={name} value={name}>
                                                {name}
                                            </option>
                                        );
                                    })}
                                </Select>
                            </Field>

                            <Field>
                                <label>Стан товару</label>

                                <RadioGrid>
                                    <RadioCard
                                        type="button"
                                        $active={!form.isNewState}
                                        onClick={() => handleStateChange(false)}
                                    >
                                        <strong>Б/в</strong>
                                        <span>Товар уже був у використанні</span>
                                    </RadioCard>

                                    <RadioCard
                                        type="button"
                                        $active={form.isNewState}
                                        onClick={() => handleStateChange(true)}
                                    >
                                        <strong>Новий</strong>
                                        <span>Товар не використовувався</span>
                                    </RadioCard>
                                </RadioGrid>
                            </Field>
                        </FormGrid>

                        <Field>
                            <label htmlFor="description">Опис</label>
                            <TextArea
                                id="description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Опишіть стан товару, комплектацію, причину продажу та інші важливі деталі..."
                            />
                        </Field>

                        <Field>
                            <label htmlFor="img">Фото товару</label>

                            <UploadBox>
                                <input
                                    id="img"
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg"
                                    multiple
                                    onChange={handleImagesChange}
                                />

                                <strong>Натисніть, щоб додати фото</strong>
                                <span>JPG або PNG, максимум 5 зображень</span>
                            </UploadBox>

                            <HelpText>
                                Перше фото буде головним зображенням оголошення.
                            </HelpText>
                        </Field>

                        {previews.length > 0 && (
                            <FileGrid>
                                {previews.map((preview, index) => (
                                    <FileCard key={preview}>
                                        <ImagePreview src={preview} alt={`Фото ${index + 1}`} />

                                        <button type="button" onClick={() => removeImage(index)}>
                                            Видалити
                                        </button>
                                    </FileCard>
                                ))}
                            </FileGrid>
                        )}

                        {error && <ErrorMessage>{error}</ErrorMessage>}
                        {success && <SubmitMessage>{success}</SubmitMessage>}

                        <Actions>
                            <BackButton type="button" onClick={() => router.push('/home')}>
                                Скасувати
                            </BackButton>

                            <PrimaryButton type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Публікуємо...' : 'Опублікувати оголошення'}
                            </PrimaryButton>
                        </Actions>
                    </Form>
                </FormCard>
            </PageContainer>
        </Page>
    );
}