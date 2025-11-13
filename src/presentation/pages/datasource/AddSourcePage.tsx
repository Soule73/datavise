import SourceForm from "@components/source/SourceForm";
import { useCreateDataSourceForm } from "@hooks/datasource/useCreateDataSourceForm";
import AuthLayout from "@/presentation/components/layouts/AuthLayout";
import breadcrumbs from "@/core/utils/breadcrumbs";

export default function AddSourcePage() {
  const formProps = useCreateDataSourceForm();


  return (
    <AuthLayout permission="datasource:canCreate"
      breadcrumb={breadcrumbs.datasourceCreate}
    // className="max-w-7xl mx-auto py-4 bg-white dark:bg-gray-900 px-4 sm:px-6 lg:px-8 shadow-sm"
    >
      <h1 className="text-2xl font-bold mb-6">Ajouter une source de données</h1>
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
        isEdit={false}
      />
    </AuthLayout>
  );
}
