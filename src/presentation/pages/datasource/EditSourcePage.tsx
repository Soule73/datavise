import breadcrumbs from "@/core/utils/breadcrumbs";
import AuthLayout from "@/presentation/components/layouts/AuthLayout";
import SourceForm from "@components/source/SourceForm";
import { useDataSourceForm } from "@/application/hooks/datasource/useDataSourceForm";

export default function EditSourcePage() {
  const formProps = useDataSourceForm(true);

  if (formProps.isLoading) return <div className="p-8">Chargement…</div>;
  if (formProps.error)
    return (
      <div className="p-8 text-red-500">
        Erreur lors du chargement de la source.
      </div>
    );

  return (
    <AuthLayout permission="datasource:canUpdate"
      breadcrumb={breadcrumbs.datasourceEdit(formProps.form?.name || "")}
    // className="max-w-7xl mx-auto py-4 bg-white dark:bg-gray-900 px-4 sm:px-6 lg:px-8 shadow-sm"
    >
      <h1 className="text-2xl font-bold mb-6">Modifier la source</h1>
      <SourceForm
        form={formProps.form}
        setFormField={formProps.setFormField}
        step={formProps.step}
        setStep={formProps.setStep}
        csvOrigin={formProps.csvOrigin}
        setCsvOrigin={formProps.setCsvOrigin}
        csvFile={formProps.csvFile}
        setCsvFile={formProps.setCsvFile}
        columns={formProps.columns}
        columnsLoading={formProps.columnsLoading}
        columnsError={formProps.columnsError}
        dataPreview={formProps.dataPreview}
        showModal={formProps.showModal}
        setShowModal={formProps.setShowModal}
        globalError={formProps.globalError}
        handleNext={formProps.handleNext}
        onSubmit={formProps.onSubmit}
        isEdit={true}
      />
    </AuthLayout>
  );
}
