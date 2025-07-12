import React, { useState } from "react";
import StatCard from "../components/StatCard"; // update the path as needed

const DeadInventory = () => {
  const [deadStock, setDeadStock] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedAction, setSelectedAction] = React.useState({});

  React.useEffect(() => {
    // Simulate API call to get data
    setTimeout(() => {
      // Mock dead stock data
      const mockDeadStock = [
        {
          id: 3,
          name: "Ceramic Mug",
          sku: "CM-003",
          category: "Kitchenware",
          daysWithoutSale: 45,
          totalStock: 3,
          suggestedActions: [
            { id: 1, action: "Bundle with coffee beans", impact: "High" },
            { id: 2, action: "Transfer to Downtown Store", impact: "Medium" },
            { id: 3, action: "Flash sale (30% off)", impact: "Medium" },
          ],
        },
        {
          id: 5,
          name: "Protein Powder",
          sku: "PP-005",
          category: "Health",
          daysWithoutSale: 38,
          totalStock: 6,
          suggestedActions: [
            {
              id: 1,
              action: "Flash sale (approaching expiry)",
              impact: "High",
            },
            { id: 2, action: "Bundle with shaker bottle", impact: "Medium" },
            { id: 3, action: "Donate to local gym", impact: "Low" },
          ],
        },
        {
          id: 7,
          name: "Yoga Mat",
          sku: "YM-007",
          category: "Fitness",
          daysWithoutSale: 32,
          totalStock: 8,
          suggestedActions: [
            { id: 1, action: "Bundle with yoga blocks", impact: "High" },
            { id: 2, action: "Transfer to Mall Outlet", impact: "Medium" },
            { id: 3, action: "Digital marketing campaign", impact: "Medium" },
          ],
        },
        {
          id: 9,
          name: "Smart Watch",
          sku: "SW-009",
          category: "Electronics",
          daysWithoutSale: 35,
          totalStock: 4,
          suggestedActions: [
            { id: 1, action: "Price reduction (15%)", impact: "High" },
            { id: 2, action: "Feature in newsletter", impact: "Medium" },
            {
              id: 3,
              action: "Bundle with phone accessories",
              impact: "Medium",
            },
          ],
        },
      ];

      setDeadStock(mockDeadStock);

      // Initialize selected action state
      const initialSelectedActions = {};
      mockDeadStock.forEach((item) => {
        initialSelectedActions[item.id] = item.suggestedActions[0].id;
      });
      setSelectedAction(initialSelectedActions);

      setLoading(false);
    }, 1000);
  }, []);

  const handleActionChange = (productId, actionId) => {
    setSelectedAction((prev) => ({
      ...prev,
      [productId]: actionId,
    }));
  };

  const handleActionSubmit = (productId) => {
    const product = deadStock.find((item) => item.id === productId);
    const action = product.suggestedActions.find(
      (a) => a.id === parseInt(selectedAction[productId])
    );

    alert(`Action "${action.action}" has been submitted for ${product.name}.`);
  };

  const getImpactClass = (impact) => {
    switch (impact) {
      case "High":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Dead Inventory Management
        </h2>
        <div className="text-sm text-gray-500 flex items-center">
          <i className="fas fa-info-circle mr-2"></i>
          Showing products with no sales in the past 30 days
        </div>
      </div>

      {loading ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <div className="spinner mx-auto"></div>
          <p className="mt-4 text-gray-500">Analyzing inventory data...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              iconClass="fas fa-skull"
              iconColor="text-red-600"
              bgColor="bg-red-100"
              label="Dead Stock Items"
              value={deadStock.length}
            />
            <StatCard
              iconClass="fas fa-box"
              iconColor="text-yellow-600"
              bgColor="bg-yellow-100"
              label="Units in Dead Stock"
              value={deadStock.reduce((sum, item) => sum + item.totalStock, 0)}
            />
            <StatCard
              iconClass="fas fa-dollar-sign"
              iconColor="text-indigo-600"
              bgColor="bg-indigo-100"
              label="Estimated Value"
              value="$2,450"
            />
          </div>

          {/* Dead Stock Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium text-gray-800">
                Dead Stock Items
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Days Without Sale
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      AI Suggested Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {deadStock.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500">{item.sku}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-red-600 font-medium">
                          {item.daysWithoutSale} days
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.totalStock} units
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={selectedAction[item.id]}
                          onChange={(e) =>
                            handleActionChange(item.id, e.target.value)
                          }
                          className="w-full px-2 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          {item.suggestedActions.map((action) => (
                            <option key={action.id} value={action.id}>
                              {action.action} ({action.impact} impact)
                            </option>
                          ))}
                        </select>
                        <div className="mt-1 flex items-center">
                          <span className="text-xs mr-2">Impact:</span>
                          {item.suggestedActions.find(
                            (a) => a.id === parseInt(selectedAction[item.id])
                          ) && (
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getImpactClass(
                                item.suggestedActions.find(
                                  (a) =>
                                    a.id === parseInt(selectedAction[item.id])
                                ).impact
                              )}`}
                            >
                              {
                                item.suggestedActions.find(
                                  (a) =>
                                    a.id === parseInt(selectedAction[item.id])
                                ).impact
                              }
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleActionSubmit(item.id)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md"
                        >
                          Apply
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-indigo-50 p-6 rounded-lg shadow-sm border border-indigo-100">
            <h3 className="text-lg font-medium text-indigo-800 mb-3">
              <i className="fas fa-lightbulb mr-2"></i> Tips for Managing Dead
              Inventory
            </h3>
            <ul className="space-y-2 text-indigo-700">
              <li className="flex items-start">
                <i className="fas fa-check-circle mt-1 mr-2"></i>
                <span>
                  Bundle slow-moving items with popular products to increase
                  sales.
                </span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle mt-1 mr-2"></i>
                <span>
                  Consider relocating products to stores with different customer
                  demographics.
                </span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle mt-1 mr-2"></i>
                <span>
                  Limited-time flash sales can help clear aging inventory
                  quickly.
                </span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle mt-1 mr-2"></i>
                <span>
                  For seasonal items, consider storing until the appropriate
                  season returns.
                </span>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};
export default DeadInventory;
