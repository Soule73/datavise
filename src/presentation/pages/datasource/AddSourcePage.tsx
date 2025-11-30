import SourceForm from "./components/SourceForm";
import { useDataSourceForm } from "@hooks/datasource/useDataSourceForm";
import breadcrumbs from "@/core/utils/breadcrumbs";
import AuthLayout from "@/presentation/layout/AuthLayout";
import { Section } from "@datavise/ui";

export default function AddSourcePage() {
  const formProps = useDataSourceForm(false);


  return (
    <AuthLayout permission="datasource:canCreate"
      breadcrumb={breadcrumbs.datasourceCreate}
    >
      <Section>
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
      </Section>
    </AuthLayout>
  );
}
