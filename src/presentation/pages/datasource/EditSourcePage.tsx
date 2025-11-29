import breadcrumbs from "@/core/utils/breadcrumbs";
import AuthLayout from "@/presentation/components/shared/layouts/AuthLayout";
import SourceForm from "@components/source/SourceForm";
import { useDataSourceForm } from "@/application/hooks/datasource/useDataSourceForm";
import Section from "@/presentation/components/shared/Section";

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
    >
      <Section>
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
      </Section>
    </AuthLayout>
  );
}
