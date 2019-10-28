package com.example.firebase_20190925;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;

public class PolicyDetailActivity extends AppCompatActivity {

    ArrayList<Policy> policyList = new ArrayList<>();

    TextView tv_title, tv_age, tv_target, tv_registDate;
    Button btn_wish;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_policy_detail);

        final int policyCode = getIntent().getIntExtra("policyCode", 1);
        getJsonString();

        tv_title = findViewById(R.id.tv_policyTitle);
        tv_age = findViewById(R.id.tv_policyAge);
        tv_target = findViewById(R.id.tv_policyTarget);
        tv_registDate = findViewById(R.id.tv_policyRegistDate);
        btn_wish = findViewById(R.id.btn_wish);

        tv_title.setText(policyList.get(policyCode-1).getTitle());
        tv_age.setText("연령: "+policyList.get(policyCode-1).getAge());
        tv_target.setText("대상: "+policyList.get(policyCode-1).getTarget());
        tv_registDate.setText("기간: "+policyList.get(policyCode-1).getRegistDate());

        btn_wish.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                add2wishList(policyCode);
            }
        });
    }

    // firebase에 어떻게저쩧게 알람 설정해보기
    // 날짜, 타이틀, 코드 저장해해놓고
    // 알람에 타이틀 뜨게하고 누르면 해당 글로 연결(코드 이용)
    private void add2wishList(int policyCode) {

    }


    private void getJsonString()
    {
        String json = "";

        try {
            InputStream is = getAssets().open("policylist.json");
            int fileSize = is.available();

            byte[] buffer = new byte[fileSize];
            is.read(buffer);
            is.close();

            json = new String(buffer, "UTF-8");
        }
        catch (IOException ex)
        {
            ex.printStackTrace();
        }

        jsonParsing(json);
    }

    private void jsonParsing(String json)
    {
        try{
            JSONObject jsonObject = new JSONObject(json);

            JSONArray policyArray = jsonObject.getJSONArray("Policy");

            for(int i=0; i<policyArray.length(); i++)
            {
                JSONObject policyObject = policyArray.getJSONObject(i);

                Policy policy = new Policy();

                policy.setCode(policyObject.getString("code"));
                policy.setTitle(policyObject.getString("title"));
                policy.setAge(policyObject.getString("age"));
                policy.setTarget(policyObject.getString("target"));
                policy.setRegistDate(policyObject.getString("registDate"));

                policyList.add(policy);
            }
        }catch (JSONException e) {
            e.printStackTrace();
        }
    }

}
