describe("Framework Selection Flow", () => {
  beforeEach(() => {
    cy.visit("/"); // Visit the root URL of the application
  });

  it("should allow selecting a category and then a framework, displaying its components", () => {
    // 1. Select a category (e.g., "Koleksi & Inovasi")
    cy.contains("button", "Koleksi & Inovasi").click();
    cy.contains("h2", "Koleksi & Inovasi"); // Verify category header

    // 2. Select a subcategory (e.g., "Bisnis")
    cy.contains("button", "Bisnis").click();
    cy.contains("h2", "Bisnis"); // Verify subcategory header

    // 3. Select a framework (e.g., "Pusat Analisis Keuangan & Investasi")
    cy.contains("button", "Pusat Analisis Keuangan & Investasi").click();
    cy.contains("h3", "Pusat Analisis Keuangan & Investasi"); // Verify framework title
    cy.contains(
      "p",
      "Pusat komando untuk semua kebutuhan analisis keuangan dan investasi",
    ); // Verify framework description

    // 4. Verify that components are displayed (check for a few specific labels)
    cy.contains("label", "Jenis Analisis Keuangan").should("be.visible");
    cy.contains("label", "Tujuan Investasi Anda").should("not.exist"); // Should not be visible initially for this framework
  });

  it("should display dynamic components when a trigger option is selected", () => {
    // 1. Select a category and framework that has dynamic components
    cy.contains("button", "Koleksi & Inovasi").click();
    cy.contains("button", "Bisnis").click();
    cy.contains("button", "Pusat Analisis Keuangan & Investasi").click();

    // 2. Select an option that triggers dynamic components (e.g., "Perencanaan Strategi Investasi")
    cy.get('select[name="TUGAS_ANALISIS_KEUANGAN"]').select(
      "Perencanaan Strategi Investasi",
    );

    // 3. Verify that dynamic components are now visible
    cy.contains("label", "Tujuan Investasi Anda").should("be.visible");
    cy.contains("label", "Modal Awal & Investasi Bulanan").should("be.visible");
    cy.contains("label", "Toleransi Risiko Anda").should("be.visible");
    cy.contains("label", "Horizon Waktu Investasi").should("be.visible");
  });

  it("should allow input into form fields and update the preview", () => {
    // 1. Select a category and framework
    cy.contains("button", "Koleksi & Inovasi").click();
    cy.contains("button", "Bisnis").click();
    cy.contains("button", "Pusat Analisis Keuangan & Investasi").click();

    // 2. Select an option that triggers dynamic components
    cy.get('select[name="TUGAS_ANALISIS_KEUANGAN"]').select(
      "Perencanaan Strategi Investasi",
    );

    // 3. Type into a dynamic input field
    const investmentGoal = "Membeli rumah dalam 5 tahun";
    cy.get('input[name="TUJUAN_INVESTASI"]').type(investmentGoal);

    // 4. Verify the input value appears in the natural language preview
    cy.get("#natural-language-preview").should(
      "contain",
      `Tujuan Investasi Anda: ${investmentGoal}`,
    );
  });
});
